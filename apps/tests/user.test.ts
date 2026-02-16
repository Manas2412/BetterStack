import axios from "axios";
import { describe, it, expect } from "bun:test";
import { BACKEND_URL } from "./config";

const USER_NAME = Math.random().toString()

describe("Signup endpoint", () => {
    it("Isn't able to sign up if body is incorrect", async () => {
        try {
            const res = await axios.post(`${BACKEND_URL}/user/sign-up`, {
                email: USER_NAME,
                password: "password"
            });
            expect(false).toBe(true); // Control shouldn't reach here
        } catch (e) {
            console.log(e);
        }
    })

    it("Isn't able to sign up if body is incorrect", async () => {
            const res = await axios.post(`${BACKEND_URL}/user/sign-up`, {
                email: USER_NAME,
                password: "password"
            });
            expect(res.status).toBe(200); 
            expect(res.data.id).toBeDefined();
    });
}); 


describe("Signin endpoint", () => {
    it("Isn't able to sign in if body is incorrect", async () => {
        try {
            const res = await axios.post(`${BACKEND_URL}/user/sign-in`, {
                email: USER_NAME,
                password: "password"
            });
            expect(false).toBe(true); // Control shouldn't reach here
        } catch (e) {
            console.log(e);
        }
    })

    it("Isn't able to sign in if body is incorrect", async () => {
            const res = await axios.post(`${BACKEND_URL}/user/sign-in`, {
                email: USER_NAME,
                password: "password"
            });
            expect(res.status).toBe(200); 
            expect(res.data.jwt).toBeDefined();
    });
}); 