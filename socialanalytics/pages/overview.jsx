import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import Select from "react-select";

import Image from "next/image";
import Router from "next/router";

import EngagementLine from "../components/EngagementLine";
import Layout from "../components/Layout";
import SentimentBar from "../components/SentimentBar";

import APICall from "../APICall";
import { useLogin } from "../context/UserContext";
import { TypeOptions } from "../data/TypeOptions";

const customStyles = {
  input: (base) => ({
    ...base,
    color: "inherit"
  }),
  option: (base, state) => ({
    ...base,
    color: state.isFocused ? "white": "black",
    backgroundColor: state.isFocused ? "#216ba5" : "white"
  }),
  control: (base, state) => ({
    ...base,
    background: "inherit",
    borderColor: state.isFocused ? "white" : "white",
    borderRadius: state.isFocused ? 0 : 0,
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      color: "white"
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: "inherit"
  }),
  dropdownIndicator: (base) => ({
    ...base,
    "&:hover": {
      color: "white"
    }
  })
};

const overview = () => {
  const { user } = useLogin();

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(TypeOptions[0]);
  const [sentimentFacebook, setSentimentFacebook] = useState();
  const [sentimentInstagram, setSentimentInstagram] = useState();
  const [sentimentTwitter, setSentimentTwitter] = useState();
  const [sentimentYoutube, setSentimentYoutube] = useState();
  const [engagementFacebook, setEngagementFacebook] = useState();
  const [engagementInstagram, setEngagementInstagram] = useState();
  const [engagementTwitter, setEngagementTwitter] = useState();
  const [engagementYoutube, setEngagementYoutube] = useState();
  const [engagementData, setEngagementData] = useState({
    facebook: [],
    instagram: [],
    twitter: [],
    youtube: [],
    label: []
  });

  useEffect(() => {
    if(!user){
      if(!localStorage.getItem("BIAuthTokens")){
        Router.push("/login");
      }
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);

    APICall.getFacebookSentimentOverview(type.value)
      .then((response) => {
        const unavailable_sentiment = ["POSITIVE", "NEUTRAL", "NEGATIVE"].filter(sentiment => !Object.keys(response).includes(sentiment));
        Array.isArray(unavailable_sentiment) && unavailable_sentiment.map(sentiment => {
          if(response){
            response[sentiment] = 0;
          }
        });
        setSentimentFacebook(response);
      });

    APICall.getInstagramSentimentOverview(type.value)
      .then((response) => {
        const unavailable_sentiment = ["POSITIVE", "NEUTRAL", "NEGATIVE"].filter(sentiment => !Object.keys(response).includes(sentiment));
        Array.isArray(unavailable_sentiment) && unavailable_sentiment.map(sentiment => {
          if(response){
            response[sentiment] = 0;
          }
        });
        setSentimentInstagram(response);
      });

    APICall.getTwitterSentimentOverview(type.value)
      .then((response) => {
        const unavailable_sentiment = ["POSITIVE", "NEUTRAL", "NEGATIVE"].filter(sentiment => !Object.keys(response).includes(sentiment));
        Array.isArray(unavailable_sentiment) && unavailable_sentiment.map(sentiment => {
          if(response){
            response[sentiment] = 0;
          }
        });
        setSentimentTwitter(response);
      });

    APICall.getYoutubeSentimentOverview(type.value)
      .then((response) => {
        const unavailable_sentiment = ["POSITIVE", "NEUTRAL", "NEGATIVE"].filter(sentiment => !Object.keys(response).includes(sentiment));
        Array.isArray(unavailable_sentiment) && unavailable_sentiment.map(sentiment => {
          if(response){
            response[sentiment] = 0;
          }
        });
        setSentimentYoutube(response);
      });

    APICall.getFacebookEngagementOverview(type.value)
      .then((response) => {
        let result = Array.isArray(response) && response.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
        setEngagementFacebook(result);
      })

    APICall.getInstagramEngagementOverview(type.value)
      .then((response) => {
        let result = Array.isArray(response) && response.sort((a,b) => new Date(a.taken_at) - new Date(b.taken_at));
        setEngagementInstagram(result);
        setLoading(false);
      })
    
    APICall.getTwitterEngagementOverview(type.value)
      .then((response) => {
        let result = Array.isArray(response) && response.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
        setEngagementTwitter(result);
      })
    
    APICall.getYoutubeEngagementOverview(type.value)
      .then((response) => {
        let result = Array.isArray(response) && response.sort((a,b) => new Date(a.publishedat) - new Date(b.publishedat));
        setEngagementYoutube(result);
      })

  }, [type]);

  useEffect(() => {

    const facebook = Array.isArray(engagementFacebook)  && engagementFacebook.reduce((obj,v) => {
      let date = new Date(v.created_at);
      date = date.toDateString();
      let index = obj.findIndex(item => item.x === date);
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + v.engagement;
      } else{
        let object = {};
        object["x"] =  date;
        object["y"] = v.engagement;
        obj.push(object);
      }
      return obj;
    }, []);

    const instagram = Array.isArray(engagementInstagram)  && engagementInstagram.reduce((obj,v) => {
      let date = new Date(v.taken_at);
      date = date.toDateString();
      let index = obj.findIndex(item => item.x === date);
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + v.engagement;
      } else{
        let object = {};
        object["x"] =  date;
        object["y"] = v.engagement;
        obj.push(object);
      }
      return obj;
    }, []);

    const twitter = Array.isArray(engagementTwitter)  && engagementTwitter.reduce((obj,v) => {
      let date = new Date(v.created_at);
      date = date.toDateString();
      let index = obj.findIndex(item => item.x === date);
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + v.engagement;
      } else{
        let object = {};
        object["x"] =  date;
        object["y"] = v.engagement;
        obj.push(object);
      }
      return obj;
    }, []);

    const youtube = Array.isArray(engagementYoutube)  && engagementYoutube.reduce((obj,v) => {
      let date = new Date(v.publishedat);
      date = date.toDateString();
      let index = obj.findIndex(item => item.x === date);
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + v.engagement;
      } else{
        let object = {};
        object["x"] =  date;
        object["y"] = v.engagement;
        obj.push(object);
      }
      return obj;
    }, []);

    const combinedEngagement = Array.isArray(facebook) && facebook.concat(instagram, twitter, youtube);

    const label = Array.isArray(combinedEngagement) && Array.from(new Set(combinedEngagement.map(item => item.x)));

    setEngagementData({
      facebook: facebook,
      instagram: instagram,
      twitter: twitter,
      youtube: youtube,
      label: label
    });

  }, [engagementFacebook, engagementInstagram, engagementTwitter, engagementYoutube]);

  if(loading){
    return(
      <Layout activePage="overview">
        <section className="grid">
          <div className="loading">
            <Image
              src="/bi-b.png"
              alt="Bank Indonesia Logo"
              width={220.1}
              height={65}
            />
            <BarLoader width={200}/>
          </div>
        </section>
      </Layout>
    )
  } else {
    return (
      <Layout activePage="overview">
        <section className="grid grid-cols-12">
          <div className="col-start-10 col-span-2">
            <Select 
                options={TypeOptions}
                value={type}
                defaultValue={type}
                onChange={(selected) => {
                  setType(selected)
                }}
                placeholder="Select a profile.."
                styles={customStyles}
            />
          </div>
        </section>

        <h3>Sentiment Analysis</h3>
        <section className="grid grid-cols-12 my-4">
          <div className="col-start-2 col-span-9">
            <SentimentBar data={{
              facebook: sentimentFacebook,
              instagram: sentimentInstagram,
              twitter: sentimentTwitter,
              youtube: sentimentYoutube 
            }}/>
          </div>
        </section>

        <h3>Total Engagement Rate</h3>
        <section className="grid grid-cols-12 my-4">
          <div className="col-start-2 col-span-9">
            <EngagementLine data={engagementData} media={"overview"}/>
          </div>
        </section>
      </Layout>
    );
  };
};

export default overview;
