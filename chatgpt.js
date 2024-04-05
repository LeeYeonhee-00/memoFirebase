require("dotenv").config();
const OpenAIApi = require("openai");

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

async function callChatGPT(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "ft:gpt-3.5-turbo-0125:personal:mori-test2:97gISaiY",
      messages: [
        {
          role: "system",
          content:
            "기억에 관련된 다양한 질문으로 대화를 이끌어가는 친절한 챗봇 Mori입니다. Mori는 사용자가 공유하는 기억에 대해 깊이 있게 탐색하고 더 많은 질문을 제시하는 챗봇입니다. 사용자가 언급한 특정 사건이나 경험에 대해 추가적인 질문을 통해 그 기억을 더욱 풍부하게 만듭니다. Mori는 사용자가 제시한 기억에 대해 연관된 질문을 생성하여 대화를 지속적으로 이어갑니다. 이 과정에서 사용자는 자신의 기억을 더욱 세부적으로 탐색하고 공유할 수 있습니다. Mori는 또한 사용자가 대화를 마칠 준비가 되었을 때 이를 존중하고, 언제든지 대화를 재개할 준비가 되어 있습니다. 사용자와의 대화에서 가장 중요한 것은 신뢰와 존중입니다. Mori는 사용자가 편안하게 기억을 공유하고 탐색할 수 있는 환경을 조성하기 위해 최선을 다합니다.",
        },
        { role: "user", content: message },
      ],
    });

    const answer = response.choices[0].message.content;
    //console.log('ChatGPT 답변:', answer);

    return answer;
  } catch (error) {
    console.error("ChatGPT 요청 중 오류:", error);
    throw error;
  }
}

module.exports = { callChatGPT };

// Path: functions/index.js
// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await getFirestore()
    .collection("messages")
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
  // Grab the current value of what was written to Firestore.
  const original = event.data.data().original;

  // Access the parameter `{documentId}` with `event.params`
  logger.log("Uppercasing", event.params.documentId, original);

  const uppercase = original.toUpperCase();

  // You must return a Promise when performing
  // asynchronous tasks inside a function
  // such as writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return event.data.ref.set({ uppercase }, { merge: true });
});

// test api 추가
const functions = require("firebase-functions");

exports.test = functions
  .region("us-central1")
  .https.onRequest((request, response) => {
    response.send("Hello World!");
  });

// gpt
// const functions = require("firebase-functions");
// const openai = require("openai");

// // OpenAI API Key 설정
// const apiKey = "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";
// openai.api_key = apiKey;

// // Firebase Cloud Functions를 통해 API 엔드포인트를 생성합니다.
// exports.chat = functions.https.onRequest(async (req, res) => {
//   try {
//     // 요청에서 messages를 가져옵니다.
//     const { messages } = req.body;

//     // Chat Completion을 위한 요청을 생성합니다.
//     const response = await openai.ChatCompletion.create({
//       model: "ft:gpt-3.5-turbo-0125:personal:mori-test2:97gISaiY",
//       messages,
//     });

//     // 응답을 클라이언트에게 보냅니다.
//     res.json({ response: response.choices[0].message.content });
//   } catch (error) {
//     // 오류 발생 시 오류 메시지를 클라이언트에게 보냅니다.
//     res.status(500).json({ error: error.message });
//   }
// });

// 추가
// var { callChatGPT } = require("chatgpt");

// // ChatGPT에 대화식으로 요청 보내기
// // postText가 100자 이내로 요약할 전체 내용
// let gptContent =
//   postText.length > 4000 ? postText.substring(0, 4000) : postText;
// let gptResponse = await callChatGPT(gptContent);
// if (gptResponse) {
//   console.log(postnum + " chatGPT API 응답: " + gptResponse);
// } else {
//   console.log(postnum + " chatGPT API 응답 실패!");
// }

// if (gptResponse != "") {
//   //블로그 API로 ChatGPT API 응답 내용을 meta description에 저장
// }

// const functions = require("firebase-functions");
const axios = require("axios");
require("dotenv").config();

exports.chatGPT = functions.https.onRequest(async (request, response) => {
  const { message } = request.body; // 클라이언트로부터 받은 메시지

  if (!message) {
    response.status(400).send("Message is required");
    return;
  }

  try {
    // OpenAI ChatGPT API를 호출합니다.
    const openAIResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions", // OpenAI의 ChatGPT 엔드포인트
      {
        model: "${process.env.MORI_MORI_MODEL_ID", // 모델을 지정합니다.
        messages: [
          {
            role: "system",
            content: "${process.env.MORI_SYSTEM_CONTEN}",
          },
          { role: "user", content: message },
        ], // 사용자 메시지를 포함합니다.
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ChatGPT의 응답을 클라이언트에게 반환합니다.
    response.send(openAIResponse.data);
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    response.status(500).send("Error calling OpenAI API");
  }
});


// Firebase Realtime Database에 요약 결과 저장
    const db = admin.database();
    const ref = db
      .ref("https://memori-7aab6-default-rtdb.firebaseio.com/")
      .push();
    await ref.set({
      originalMessages: messages,
      summary: summary,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    });

    response.json({ success: true, summary: summary });
  } catch (error) {
    console.error("Error calling OpenAI or saving to database:", error);
    response.status(500).send("Error processing your request.");
  }


  exports.chatMORI = functions.https.onRequest(async (request, response) => {
  const {message} = request.body; // 클라이언트로부터 받은 메시지

  if (!message) {
    response.status(400).send("Message is required");
    return;
  }

  try {
    const openAIResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: MORI_MODEL_ID,
          messages: [
            {role: "system", content: MORI_SYSTEM_CONTENT},
            {role: "user", content: message},
          ],
        },
        {
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        },
    );

    // API 응답에서 content만 추출하여 클라이언트에게 반환합니다.
    const content = openAIResponse.data.choices[0].message.content;
    response.send({content});
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    response.status(500).send("Error calling OpenAI API");
  }
});