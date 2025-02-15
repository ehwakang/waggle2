import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import "../style/global.css";
import { ITweet } from "./timeline";
// import { ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 15px 20px;
  border-radius: 20px;
  font-size: 16px;
  line-height: 30px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  overflow: hidden;
  &::placeholder {
    // color: red;
  }
  &:focus {
    outline: none;
    border-color: #24a4f2;
  }
`;
const AttachFileInput = styled.input`
  display: none;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;

const AttachFileButton = styled.label`
  flex: 1;
  padding: 10px;
  color: #24a4f2;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #24a4f2;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 10px;
`;

const SubmitBtn = styled.input`
  flex: 1;
  background-color: #24a4f2;
  color: white;
  font-weight: 600;
  border-radius: 20px;
  border: none;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

interface PostTweetFormProps {
  editMode?: boolean;
  initialData?: ITweet;
  onClose: () => void;
}

export default function PostTweetForm({
  editMode = false,
  initialData,
  onClose,
}: PostTweetFormProps) {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [ofile, setOfile] = useState<string | null>(null);
  const txtAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // editMode일 경우 initialData를 기반으로 값 설정
  useEffect(() => {
    if (editMode && initialData) {
      setTweet(initialData.tweet);
      setOfile(initialData.fileData || null); // 기존 파일 데이터 있으면 설정
    }
  }, [editMode, initialData]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);

    if (txtAreaRef.current) {
      txtAreaRef.current.style.height = "auto"; // 높이 초기화 (줄어드는 것도 반영)
      txtAreaRef.current.style.height = `${txtAreaRef.current.scrollHeight}px`; // 새 높이 설정
    }
  };
  // base64 인코딩
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _file = e.target.files?.[0]; // 파일 선택
    if (_file) {
      const validTypes = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(_file.type)) {
        toast.error("Only PNG, JPG, GIF, WEBP images are allowed.", {
          position: "top-right",
        });
        return;
      }
      // 🔹 파일 크기 제한 (1MB 이상이면 저장 안 함)
      if (_file.size > 1024 * 1024) {
        toast.error("File size must be less than 1MB", {
          position: "top-right",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setOfile(reader.result as string); // 파일 데이터를 상태에 설정
      };
      reader.readAsDataURL(_file); // base64로 파일 읽기
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 화면새로고침 방지
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setLoading(true);
      if (editMode && initialData?.id) {
        // 수정
        await updateDoc(doc(db, "tweets", initialData.id), {
          tweet,
          fileData: ofile ? ofile : initialData.fileData,
        });
        toast.success("Successfully updated!", { position: "top-right" });
      } else {
        // 신규작성
        await addDoc(collection(db, "tweets"), {
          tweet,
          createAt: Date.now(),
          username: user.displayName || "Anonymous",
          userId: user.uid,
          fileData: ofile,
          likeCount: 0,
          retweetCount: 0,
          replyCount: 0,
          view: 0,
        });
        // if(file) {
        //   const localRef = ref(storage, `tweets/${user.uid}/${doc.id}`)
        //   const result = await uploadBytes(locationRef, file)
        //   const url = await getDownloadURL(result.ref)
        //   await updateDoc(doc, {
        //     fileData: url
        //   })
        // }
        toast.success("Successfully posted!", { position: "top-right" });
      }
      setTweet("");
      setOfile(null);
      onClose(); // 모달 닫기
    } catch (e) {
      if (e instanceof FirebaseError)
        toast.error(e.message, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const onFileRemove = () => {
    setOfile(null); // 파일을 삭제할 때 상태 초기화
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        ref={txtAreaRef}
        required
        rows={3}
        maxLength={180}
        value={tweet}
        placeholder="What's happening?"
        onChange={onChange}
      />
      {ofile && (
        <div
          style={{
            position: "relative",
            height: "auto",
            maxHeight: "600px",
          }}
          className={editMode ? "editDiv" : ""}
        >
          <i
            title="Delete this file"
            className={`material-symbols-outlined thumbnailDel text-primary ${
              editMode ? "editClass" : ""
            }`}
            style={{
              fontSize: "32px",
              opacity: "0.7",
              position: "relative",
              left: "87%",
              transform: "translateY(50%)",
              verticalAlign: "top",
              zIndex: "10",
            }}
            onClick={onFileRemove}
          >
            delete
          </i>
          <img
            src={ofile}
            title="Thumbnail"
            style={{
              width: "100%",
              maxWidth: "600px",
              borderRadius: "15px",
              marginTop: "10px",
              objectFit: "contain",
            }}
          />
        </div>
      )}
      <ButtonContainer>
        <AttachFileButton htmlFor="file">
          {ofile ? "Photo added ✅" : "Add photo"}
        </AttachFileButton>
        <AttachFileInput
          id="file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
        <SubmitBtn
          type="submit"
          value={isLoading ? "Posting..." : editMode ? "Edit" : "POST"}
        />
      </ButtonContainer>
      <i
        className="material-symbols-outlined"
        style={{ display: "none" }}
        onClick={onClose}
      >
        close
      </i>
    </Form>
  );
}
