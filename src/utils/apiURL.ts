
// export const apiURL = "https://pt-backend-test.rdeid.unil.ch/";
// export const apiURL = "https://pt-backend.rdeid.unil.ch/";
// export const apiURL = "http://localhost:5000";

let apiURL_ = "http://localhost:5000";
console.log("starting API URL: ", apiURL);

if (typeof window !== "undefined") {
    apiURL_ = window?.__APP_CONFIG__?.API_URL || apiURL_
}

function apiURL() {
    return apiURL_;
}

export { apiURL };
