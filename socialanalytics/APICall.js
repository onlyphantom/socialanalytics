const PATH = "https://bankindonesia-backend.herokuapp.com";

export default class APICall {
    
    // Facebook
    static getFacebookProfile(name){
        return fetch(`${PATH}/api/facebook-profile/${name}`, {
            method: "GET"
        }).then((response) =>
            response.json()
        );
    }

    static getFacebookPosts(name){
        return fetch(`${PATH}/api/facebook/posts/${name}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getFacebookComments(name){
        return fetch(`${PATH}/api/facebook/comments/${name}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    // Instagram
    static getInstagramProfile(account_id){
        return fetch(`${PATH}/api/instagram-profiles/${account_id}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getInstagramPosts(account_id){
        return fetch(`${PATH}/api/instagram/posts/${account_id}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getInstagramComments(account_id){
        return fetch(`${PATH}/api/instagram/comments/${account_id}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    // Twitter
    static getTwitterProfile(user_id){
        return fetch(`${PATH}/api/twitter-profiles/${user_id}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getTwitterPosts(user_id){
        return fetch(`${PATH}/api/twitter/tweets/${user_id}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getTwitterComments(user_id){
        return fetch(`${PATH}/api/twitter/replies/${user_id}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    // Youtube
    static getYoutubeProfile(channel_id){
        return fetch(`${PATH}/api/youtube-channels/${channel_id}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getYoutubePosts(channel_id){
        return fetch(`${PATH}/api/youtube/videos/${channel_id}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getYoutubeComments(channel_id){
        return fetch(`${PATH}/api/youtube/comments/${channel_id}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }
}