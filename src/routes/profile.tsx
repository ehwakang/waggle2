import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";
// import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import "../style/global.css";
import { updateProfile } from "firebase/auth";
import { uploadImageToCloudinary } from "../util/util";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const AvatarUplaod = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 40px;
  background-color: #24a4f2;
  cursor: pointer;
  svg {
    width: 50px;
  }
`;
export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [name, setName] = useState(user?.displayName);
  const [isEdit, setIsEdit] = useState(false);
  const [tweets, setTweets] = useState<ITweet[]>([]); // 내가 작성한 트윗
  const [likedTweets, setLikedTweets] = useState<ITweet[]>([]); // 내가 좋아요 누른 트윗
  const [selectedTab, setSelectedTab] = useState("all"); // "all" or "like"

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _file = e.target.files?.[0]; // 파일 선택
    const validTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/gif",
      "image/webp",
    ];
    if (_file) {
      if (!validTypes.includes(_file.type)) {
        toast.error("Only PNG, JPG, GIF, WEBP images are allowed.");
        return;
      }
      // 🔹 파일 크기 제한 (1MB 이상이면 저장 안 함)_
      if (_file.size > 1024 * 1024) {
        toast.error("File size must be less than 1MB");
        return;
      }
      // const locationRef = ref(storage, `avatars/${user?.uid}`)
      // const result = await uploadBytes(locationRef, _file)
      // const url = await getDownloadURL(result.ref)
      // await updateProfile(user, { photoURL: url })
      // setAvatar(url)
      const reader = new FileReader();
      reader.readAsDataURL(_file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const imageUrl = await uploadImageToCloudinary(base64Data); // 비동기함수
          setAvatar(imageUrl);
        } catch (e) {
          if (e instanceof FirebaseError) toast.error(e.message);
        }
      };
    }
  };
  const onProfileDelete = async () => {
    if (user) {
      try {
        await updateProfile(user, { photoURL: "" });
        toast.success("Successfully profile image is deleted!");
        setAvatar("");
      } catch (e) {
        if (e instanceof FirebaseError) {
          toast.error(e.message + "\nFailed to delete profile image.");
        }
      }
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 화면새로고침 방지
    if (!user || name === "" || avatar === "") return;
    try {
      await updateProfile(user, { displayName: name, photoURL: avatar });
      setIsEdit(false);
      toast.success("Successfully updated!");
    } catch (e) {
      if (e instanceof FirebaseError)
        toast.error(e.message + "\nFailed to update profile.");
    }
  };

  const fetchTweets = async () => {
    if (!user?.uid) return;
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createAt", "desc")
    );
    const snapshot = await getDocs(tweetQuery);
    const fetchedTweets = snapshot.docs.map((doc) => {
      const {
        tweet,
        createAt,
        userId,
        username,
        fileData,
        likeCount,
        replyCount,
        retweetCount,
        view,
        replys,
        photoURL,
        likedUserIds,
      } = doc.data();
      return {
        tweet,
        createAt,
        userId,
        username,
        fileData,
        likeCount,
        replyCount,
        retweetCount,
        id: doc.id,
        view,
        replys,
        photoURL,
        likedUserIds,
      };
    });
    setTweets(fetchedTweets);
  };
  const fetchLikedTweets = async () => {
    if (!user?.uid) return;
    const likeQuery = query(
      collection(db, "tweets"),
      where("likedUserIds", "array-contains", user?.uid),
      orderBy("createAt", "desc")
    );
    const snapshot = await getDocs(likeQuery);
    const fetchedLikedTweets = snapshot.docs.map((doc) => {
      const {
        tweet,
        createAt,
        userId,
        username,
        fileData,
        likeCount,
        replyCount,
        retweetCount,
        view,
        replys,
        photoURL,
        likedUserIds,
      } = doc.data();
      return {
        tweet,
        createAt,
        userId,
        username,
        fileData,
        likeCount,
        replyCount,
        retweetCount,
        id: doc.id,
        view,
        replys,
        photoURL,
        likedUserIds,
      };
    });
    setLikedTweets(fetchedLikedTweets);
  };
  // 탭 변경 시 처리
  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    if (selectedTab === "like") fetchLikedTweets();
    else fetchTweets();
  }, [selectedTab]); // 컴포넌트 처음 렌더링 시 실행

  // 선택된 탭에 따라 트윗 목록 변경
  const tweetsToDisplay = selectedTab === "all" ? tweets : likedTweets;

  return (
    <div
      style={{
        margin: "0 auto",
        height: "100vh",
      }}
    >
      {avatar ? (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            style={{
              width: "80px",
              overflow: "hidden",
              height: "80px",
              borderRadius: "40px",
            }}
            src={avatar}
          />
          <i
            title="Delete profile image"
            className="material-symbols-outlined profileDelBtn ml-10"
            style={{ color: "grey" }}
            onClick={onProfileDelete}
          >
            delete
          </i>
        </span>
      ) : (
        <div className="noProfile">
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            />
          </svg>
        </div>
      )}
      <div style={{ margin: "10px 0 30px 0" }} className="row">
        <div className="col-4 profileTxt" style={{ textAlign: "left" }}>
          PROFILE
        </div>
        <div
          className="col-4 text-center"
          style={{ fontSize: "20px", lineHeight: "36px" }}
        >
          {user?.displayName ? user.displayName : "Anonymous"}
          {!isEdit && (
            <i
              title="Edit profile"
              className="material-symbols-outlined profileDelBtn ml-10"
              style={{ color: "grey" }}
              onClick={() => setIsEdit(true)}
            >
              edit_square
            </i>
          )}
        </div>
        <div className="col-4 profileTxt" style={{ textAlign: "right" }}>
          {tweets.length} Posts
        </div>
      </div>
      {isEdit && (
        <div
          style={{
            padding: "15px 30px 30px 30px",
            borderRadius: "15px",
            border: "1px solid #24a4f2",
            width: "100%",
            margin: "20px 0",
            position: "relative",
          }}
        >
          <div>
            <span
              style={{ fontSize: "22px", fontWeight: "600", color: "#1c92e0" }}
            >
              Edit profile
            </span>
            <i
              title="close"
              className="material-symbols-outlined closeBtn2"
              onClick={() => setIsEdit(false)}
            >
              close
            </i>
          </div>
          <form onSubmit={onSubmit}>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <AvatarUplaod htmlFor="avatar">
                {avatar ? (
                  <img style={{ width: "100%" }} src={avatar} />
                ) : (
                  <div className="noProfile">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      />
                    </svg>
                  </div>
                )}
                <div className="nocamera">
                  <i
                    title="Upate profile image"
                    className="material-symbols-outlined"
                    style={{
                      color: "white",
                      zIndex: "15",
                    }}
                  >
                    add_a_photo
                  </i>
                </div>
              </AvatarUplaod>
              <input
                accept="image/*"
                id="avatar"
                type="file"
                style={{ display: "none" }}
                onChange={onFileChange}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <input
                required
                type="text"
                maxLength={20}
                value={name || ""}
                placeholder="name"
                name="name"
                className="profileName"
                onChange={onChange}
              />
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  transform: "translateY(-100%)",
                }}
              >
                {name?.length} / 20
              </div>
              <br />
              <input
                type="submit"
                value="UPDATE"
                className="profileUpddateBtn"
              />
            </div>
          </form>
        </div>
      )}
      {/* All | LIKE 탭 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0",
        }}
      >
        <button
          className={`profileBtn ${selectedTab === "all" ? "active" : ""}`}
          onClick={() => handleTabClick("all")}
        >
          ALL
        </button>
        <button
          className={`profileBtn ${selectedTab === "like" ? "active" : ""}`}
          onClick={() => handleTabClick("like")}
        >
          LIKE
        </button>
      </div>

      <div className="scroll tweetWrapper">
        {tweetsToDisplay.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </div>
    </div>
  );
}
