const PATH = "https://bankindonesia-backend.herokuapp.com";

export default class APICall {
    
    // Authentication
    static loginUser(body) {
        return fetch(`${PATH}/api/token/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }).then((response) => {
          if (response.status !== 200) {
            throw response;
          }
          return response.json();
        });
    }

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

    static getFacebookEngagements(){
        return fetch(`${PATH}/api/facebook-engagement/`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getFacebookSentimentOverview(type){
        return fetch(`${PATH}/api/facebook/sentiment-overview/${type}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getFacebookEngagementOverview(type){
        return fetch(`${PATH}/api/facebook/engagement-overview/${type}`, {
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

    static getInstagramEngagements(){
        return fetch(`${PATH}/api/instagram-engagement/`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getInstagramSentimentOverview(type){
        return fetch(`${PATH}/api/instagram/sentiment-overview/${type}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getInstagramEngagementOverview(type){
        return fetch(`${PATH}/api/instagram/engagement-overview/${type}`, {
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

    static getTwitterEngagements(){
        return fetch(`${PATH}/api/twitter-engagement/`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getTwitterSentimentOverview(type){
        return fetch(`${PATH}/api/twitter/sentiment-overview/${type}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getTwitterEngagementOverview(type){
        return fetch(`${PATH}/api/twitter/engagement-overview/${type}`, {
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

    static getYoutubeEngagements(){
        return fetch(`${PATH}/api/youtube-engagement/`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getYoutubeSentimentOverview(type){
        return fetch(`${PATH}/api/youtube/sentiment-overview/${type}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }

    static getYoutubeEngagementOverview(type){
        return fetch(`${PATH}/api/youtube/engagement-overview/${type}`, {
            method: "GET"
        }).then((response) => 
            response.json()
        );
    }
}