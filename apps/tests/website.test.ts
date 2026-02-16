import { describe, it, expect } from "bun:test";
import axios from "axios";
let BASE_URL = "http://localhost:3002"

describe("Website get created", () => {
    it("Website not created if url is not present", async () => {
        try {
            await axios.post(`${BASE_URL}/website`, {

            });
            expect(false, "Website created when it shouldn't");
        } catch (err) {

        }
    })

    it("Website is created if url is present", async () => {
        const res = await axios.post(`${BASE_URL}/website`, {
            url: "https://google.com"
        });
        expect(res.data.id).not.toBeNull();
    })
})