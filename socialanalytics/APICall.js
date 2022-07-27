const PATH = "https://bankindonesia-backend.herokuapp.com";

export default class APICall {
    
    // Facebook
    static getFacebookProfiles(){
        return fetch(`${PATH}/api/facebook-profile/`, {
            method: "GET"
        }).then((response) =>
            response.json()
        );
    }

    // Instagram
    static getInstagramProfiles(){
        return fetch(`${PATH}/api/instagram-profiles/`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    // Twitter
    static getTwitterProfiles(){
        return fetch(`${PATH}/api/twitter-profiles/`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    // Youtube
    static getYoutubeProfiles(){
        return fetch(`${PATH}/api/youtube-channels/`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }
}