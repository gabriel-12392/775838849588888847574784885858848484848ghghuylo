// 1. დააყენე შენი Firebase კონფიგი აქ:

const firebaseConfig = {
  apiKey: "AIzaSyDDtN91-LhfUQhq7Wv8C7jq1RAS7I080Kw",
  authDomain: "bbcg-335ce.firebaseapp.com",
  projectId: "brizano-a1247",
  storageBucket: "brizano-a1247.appspot.com",
  messagingSenderId: "13070164719",
  appId: "1:13070164719:web:8b6226eb33aaffdab7311a"
};

// 2. დააწყებ Firebase-ს და Firestore-ს
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function payToBeach() {
  const phone = document.getElementById("phone").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const statusEl = document.getElementById("status");

  if (!phone || isNaN(amount) || amount <= 0) {
    statusEl.textContent = "გთხოვ, შეავსე ველები სწორად.";
    return;
  }

  try {
    const usersRef = db.collection("users");
    const beachRef = db.collection("beachBalance").doc("main");

    // მომხმარებლის მოძებნა ნომრით
    const snapshot = await usersRef.where("phone", "==", phone).get();
    if (snapshot.empty) {
      statusEl.textContent = "მომხმარებელი ბანკში არ მოიძებნა.";
      return;
    }

    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();

    if (userData.balance < amount) {
      statusEl.textContent = "ბალანსი არ არის საკმარისი.";
      return;
    }

    // თანხის ჩამოჭრა ბანკის ბალანსიდან და ტრანზაქციის ჩაწერა
    const newTransaction = {
      type: "გადახდა",
      amount: amount,
      target: "შენი პლიაჟი",
      date: new Date().toLocaleString()
    };

    await usersRef.doc(userId).update({
      balance: userData.balance - amount,
      transactions: firebase.firestore.FieldValue.arrayUnion(newTransaction)
    });

    // პლაჟის ბალანსის გაზრდა
    await beachRef.update({
      balance: firebase.firestore.FieldValue.increment(amount)
    });

    // ჩაწერა შეძენებში
    await db.collection("purchases").add({
      userId: userId,
      amount: amount,
      date: new Date()
    });

    statusEl.textContent = "გადახდა შესრულდა წარმატებით ✅";

  } catch (error) {
    console.error(error);
    statusEl.textContent = "დაფიქსირდა შეცდომა გადახდისას";
  }
}

