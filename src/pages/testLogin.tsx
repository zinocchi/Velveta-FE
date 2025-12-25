import api from "../api/axios";

export async function testLogin() {
  try {
    const res = await api.post("/login", {
      login: "testuser",        // bisa username
      password: "password123", // password asli
    });

    console.log("LOGIN BERHASIL");
    console.log(res.data);

    localStorage.setItem("token", res.data.token);
  } catch  {
    console.error("LOGIN GAGAL");
  }
}
