import { startTransition, useEffect, useState } from "react";
import Layout from "../components/Layout";
import Image from "next/image";
import Select from "react-select";

import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { format } from "date-fns";

import id from "date-fns/locale/id";
registerLocale("id", id);

import "react-datepicker/dist/react-datepicker.css";
import DonutPercent from "../components/DonutPercent";
import EngagementLine from "../components/EngagementLine";
import Table from "../components/Table";
import { BarLoader } from "react-spinners";

import APICall from "../APICall";
import { TwitterProfiles } from "../data/TwitterProfiles";

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

const formatNumber = n => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
};

const twitter = () => {
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date().setMonth(new Date().getMonth()-3));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedProfile, setSelectedProfile] = useState(TwitterProfiles[0]);
  const [profile, setProfile] = useState();
  const [posts, setPosts] = useState();
  const [comments, setComments] = useState();
  const [aggregate, setAggregate] = useState({
    sentiment_count : {},
    engagement_count : {}
  });
  const [lineData, setLineData] = useState({
    favorite : {},
    comment : {},
    retweet : {},
    total : {},
    label : []
  });

  useEffect(() => {
    setLoading(true);

    APICall.getTwitterProfile(selectedProfile.value)
      .then((response) => {
        setProfile(response);
      })

    APICall.getTwitterPosts(selectedProfile.value)
      .then((response) => {
        let result = response.filter((response) => new Date(response.created_at) >= startDate && new Date(response.created_at) <= endDate);
        result = Array.isArray(result) && result.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
        setPosts(result);
      })

    APICall.getTwitterComments(selectedProfile.value)
      .then((response) => {
        setComments(response.filter((response) => new Date(response.created_at) >= startDate && new Date(response.created_at) <= endDate));
        setLoading(false);
      })

  }, [selectedProfile, startDate, endDate, setProfile, setPosts, setComments, setLoading])

  useEffect(() => {
    const sentiments = Array.isArray(comments) && comments.reduce(function(obj, v) {
      obj[v.sentimentlabel] = (obj[v.sentimentlabel] || 0) + 1;
      return obj;
    }, {});

    const unavailable_sentiment = ["POSITIVE", "NEUTRAL", "NEGATIVE"].filter(sentiment => !Object.keys(sentiments).includes(sentiment));
    Array.isArray(unavailable_sentiment) && unavailable_sentiment.map(sentiment => {
      if(sentiments){
        sentiments[sentiment] = 0;
      }
    });

    const engagements = Array.isArray(posts) && posts.reduce((obj, v) => {
      obj["FAVORITES"] = (obj["FAVORITES"] || 0) + v.favorite_count;
      return obj;
    }, {});

    let favorite = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.created_at);
      date = date.toDateString();
      let index = obj.findIndex(item => item.x === date);
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + v.favorite_count;
      } else{
        let object = {};
        object["x"] = date;
        object["y"] = v.favorite_count;
        obj.push(object);
      }
      return obj;
    }, []);

    let comment = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.created_at);
      date = date.toDateString();
      let index = obj.findIndex(item => item.x === date);
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + v.comment_count;
      } else{
        let object = {};
        object["x"] =  date;
        object["y"] = v.comment_count;
        obj.push(object);
      }
      return obj;
    }, []);

    let retweet = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.created_at);
      date = date.toDateString();
      let index = obj.findIndex(item => item.x === date);
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + v.retweet_count;
      } else{
        let object = {};
        object["x"] =  date;
        object["y"] = v.retweet_count;
        obj.push(object);
      }
      return obj;
    }, []);

    let total = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.created_at);
      date = date.toDateString();
      let value = v.favorite_count + v.comment_count + v.retweet_count;
      let index = obj.findIndex(item => item.x === date);
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + value;
      } else{
        let object = {};
        object["x"] =  date;
        object["y"] =  value;
        obj.push(object);
      }
      return obj;
    }, []);

    let label = Array.isArray(posts) && posts.reduce((obj,v) => {
      let date = new Date(v.created_at);
      date = date.toDateString();
      obj.push(date);
      return obj;
    }, []);

    label = Array.isArray(label) && Array.from(new Set(label))
    
    setAggregate({
      engagement_count: engagements,
      sentiment_count: sentiments
    });

    setLineData({
      favorite: favorite,
      comment: comment,
      retweet: retweet,
      total: total,
      label: label
    });

  }, [comments, posts])

  if(loading){
    return(
      <Layout activePage="twitter">
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
      <Layout activePage="twitter">
        {/* <h1>Twitter</h1> */}
        <section className="grid grid-cols-12">
          <div className="col-start-9 col-span-3">
            <Select 
                options={TwitterProfiles}
                value={selectedProfile}
                defaultValue={selectedProfile}
                onChange={(selected) => {
                  setSelectedProfile(selected)
                }}
                placeholder="Select a profile.."
                styles={customStyles}
            />
          </div>
        </section>
  
        <section className="grid grid-cols-12 my-5">
          <div className="stats shadow col-start-1 col-span-11">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Followers</div>
              <div className="stat-value">{profile.followers_count === null ? "-" : formatNumber(profile.followers_count)}</div>
              {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
            </div>
  
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Friends</div>
              <div className="stat-value">{profile.friends_count === null ? "-" : formatNumber(profile.friends_count)}</div>
              {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
            </div>
              
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Tweets</div>
              <div className="stat-value">{profile.statuses_count === null ? "-" : formatNumber(profile.statuses_count)}</div>
              {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-12 my-5">
          <div className="col-span-4">
            <h5>Comments' Sentiment Analysis</h5>
          </div>
          <div className="col-start-7 col-span-5 flex gap-x-2 max-w-xs">
            {/* https://github.com/Hacker0x01/react-datepicker */}
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={new Date()}
              locale="id"
              showMonthDropdown
              className="col-span-1 max-w-xxs"
            />
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={new Date()}
              locale="id"
              showMonthDropdown
              className="col-span-1 max-w-xxs"
            />
          </div>
        </section>
  
        <section className="grid grid-cols-12 my-5">
            {
              Array.isArray(comments) && comments.length > 0 ? (
                <>
                <div className="col-span-4">
                  <DonutPercent data={aggregate}/>
                </div>
                <div className="col-start-7 col-span-5">
                  <div className="stats stats-vertical shadow">
                  <div className="stat">
                      <div className="stat-title">Positive Comments</div>
                      <div className="stat-value">{formatNumber(aggregate.sentiment_count.POSITIVE)}</div>
                      <div className="stat-desc">
                        {format(startDate, "MMMM do, yyyy")} -
                        {format(endDate, "MMMM do, yyyy")}
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-title">Positive Reactions</div> 
                      <div className="stat-value">{formatNumber(aggregate.engagement_count.FAVORITES)}</div>
                      <div className="stat-desc">
                        {format(startDate, "MMMM do, yyyy")} -
                        {format(endDate, "MMMM do, yyyy")}
                      </div>
                    </div>
                    {/* <div className="stat">
                      <div className="stat-title">New Registers</div>
                      <div className="stat-value">1,200</div>
                      <div className="stat-desc">↘︎ 90 (14%)</div>
                    </div> */}
                  </div>
                </div>
                </> 
               ) : (
                <div className="col-span-4">
                  <div className="stat-title">No comments available.</div>  
                </div>
               )
            }
        </section>
        {
            Array.isArray(posts) && posts.length > 0 ? (
              <section className="grid grid-cols-12 my-5">
                <div className="col-span-6">
                  <h5>Engagement Rate Analysis</h5>
                  <EngagementLine data={lineData} media="twitter"/>
                </div>
                <div className="col-span-6 ml-5">
                  <h5>Significant Variables</h5>
                  <div className="tabs">
                    <a className="tab tab-bordered">Positive</a>
                    <a className="tab tab-bordered tab-active">Negative</a>
                  </div>
                  <div className="tab-content">
                    <Table />
                  </div>
                </div>
              </section>
            ) : (
              <>
              <section className="grid grid-cols-12 my-5">
                <div className="col-span-6">
                  <h5>Engagement Rate Analysis</h5>
                </div>
              </section>

              <section className="grid grid-cols-12 my-5">
                <div className="col-span-4">
                  <div className="stat-title">No posts available.</div>  
                </div>
              </section>
              </>
            )
        } 
      </Layout>
    );
  }
};

export default twitter;
