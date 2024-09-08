// src/api/api.js
import {
  ref,
  set,
  get,
  push,
  child,
  update,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { database } from "../firebase";
const storage = getStorage();

/**
 * Upload a file to Firebase Storage and get its URL.
 * @param {File} file - The file to upload.
 * @returns {Promise<string>} - The download URL of the uploaded file.
 */
export const uploadFile = async (file) => {
  const fileRef = storageRef(storage, `images/${file.name}`);

  await uploadBytes(fileRef, file);

  const url = await getDownloadURL(fileRef);
  return url;
};

// GET 所有 proposals
export const getAllProposals = async () => {
  const response = await fetch(
    "https://townpass-rldb-default-rtdb.asia-southeast1.firebasedatabase.app/proposals.json"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch proposals");
  }
  const data = await response.json();
  console.log(data)
  return Object.values(data);
};

// GET 特定 proposal_id 的資料
export const getProposalById = async (proposalId) => {
  console.log(proposalId);
  const response = await fetch(
    `https://townpass-rldb-default-rtdb.asia-southeast1.firebasedatabase.app/proposals/${proposalId}.json`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch proposal");
  }

  const data = await response.json();
  console.log(data);
  return data;
};

// GET 特定 proposal_id 下所有 comments
export const getCommentsByProposalId = async (proposalId) => {
  const response = await fetch(
    "https://townpass-rldb-default-rtdb.asia-southeast1.firebasedatabase.app/comments.json"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  const data = await response.json();
  const comments = Object.values(data);
  return comments.filter((comment) => comment.proposal_id === proposalId);
};

// POST 新的 proposal 資料
export const createProposal = async (proposalData, photo) => {
  try {
    const photoUrl = photo ? await uploadFile(photo) : "";

    const newProposalRef = push(ref(database, 'proposals'));
    const proposal_id = newProposalRef.key;
    proposalData.photo = photoUrl;
    proposalData.proposal_id = proposal_id;

    await set(newProposalRef, proposalData);
    return proposal_id;

    // const response = await fetch(
    //   "https://townpass-rldb-default-rtdb.asia-southeast1.firebasedatabase.app/proposals.json",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(proposalData),
    //   }
    // );

    // if (!response.ok) {
    //   throw new Error(`Error creating proposal: ${response.statusText}`);
    // }
    
    // const data = await response.json();
    // return data.name; // Firebase generates a unique key for each new entry
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// POST 新的 comment 資料
export const createComment = async (commentData) => {
  try {
    const response = await fetch(
      "https://townpass-rldb-default-rtdb.asia-southeast1.firebasedatabase.app/comments.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      }
    );

    if (!response.ok) {
      throw new Error(`Error creating comment: ${response.statusText}`);
    }

    const data = await response.json();
    return data.name; // Firebase generates a unique key for each new entry
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// PUT 增加 proposal 的 view 數量
export const incrementViewCount = async (proposalId) => {
  const proposalRef = ref(database, `proposals/${proposalId}`);
  const snapshot = await get(proposalRef);
  const proposal = snapshot.val();
  const view = Number(proposal.view_count);
  const newViewCount = view + 1;
  await update(proposalRef, { view_count: newViewCount.toString() });
};

// PUT 增加 proposal 的 like 數量
export const incrementLikeCount = async (proposalId) => {
  const proposalRef = ref(database, `proposals/${proposalId}`);
  const snapshot = await get(proposalRef);
  const proposal = snapshot.val();
  const like = Number(proposal.like_count);
  const newLikeCount = like + 1;
  await update(proposalRef, { like_count: newLikeCount.toString() });
};