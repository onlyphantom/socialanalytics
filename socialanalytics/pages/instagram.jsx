import { startTransition, useEffect, useState } from "react";
import Layout from "../components/Layout";

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

import APICall from "../APICall";
import { InstagramProfiles } from "../data/InstagramProfiles";

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

const instagram = () => {
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date().setMonth(new Date().getMonth()-1));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedProfile, setSelectedProfile] = useState(InstagramProfiles[0]);
  const [profile, setProfile] = useState();
  const [posts, setPosts] = useState();
  const [comments, setComments] = useState();
  const [aggregate, setAggregate] = useState({
    sentiment_count : {},
    engagement_count : {}
  });
  const [lineData, setLineData] = useState({
    like : {},
    comment : {},
    total : {},
    label : []
  });

  useEffect(() => {
    setLoading(true);

    APICall.getInstagramProfile(selectedProfile.value)
      .then((response) => {
        setProfile(response);
      })

    APICall.getInstagramPosts(selectedProfile.value)
      .then((response) => {
        let result = response.filter((response) => new Date(response.taken_at) >= startDate && new Date(response.taken_at) <= endDate);
        result = Array.isArray(result) && result.sort((a,b) => new Date(a.taken_at) - new Date(b.taken_at));
        setPosts(result);
      })

    APICall.getInstagramComments(selectedProfile.value)
      .then((response) => {
        setComments(response.filter((response) => new Date(response.created_at_utc) >= startDate && new Date(response.created_at_utc) <= endDate));
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
      obj["LIKES"] = (obj["LIKES"] || 0) + v.like_count;
      return obj;
    }, {});

    let like = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.taken_at);
      date = date.toDateString();
      let index = obj.findIndex(item => item.x === date);
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + v.like_count;
      } else{
        let object = {};
        object["x"] = date;
        object["y"] = v.like_count;
        obj.push(object);
      }
      return obj;
    }, []);

    let comment = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.taken_at);
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

    let total = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.taken_at);
      date = date.toDateString();
      let value = v.like_count + v.comment_count;
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
      let date = new Date(v.taken_at);
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
      like: like,
      comment: comment,
      total: total,
      label: label
    });

  }, [comments, posts])

  if(loading){
    return(
      <>
        <Layout activePage="instagram">
          Loading 
        </Layout>
      </>
    )
  } else {
    return (
      <Layout activePage="instagram">
        {/* <h1>Facebook</h1> */}
        <section className="grid grid-cols-12">
          <div className="col-start-9 col-span-3">
            <Select 
                options={InstagramProfiles}
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Followers</div>
              <div className="stat-value">{profile.follower_count === null ? "-" : formatNumber(profile.follower_count)}</div>
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
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Following</div>
              <div className="stat-value">{profile.following_count === null ? "-" : formatNumber(profile.following_count)}</div>
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
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Posts</div>
              <div className="stat-value">{profile.media_count === null ? "-" : formatNumber(profile.media_count)}</div>
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
                      <div className="stat-value">{formatNumber(aggregate.engagement_count.LIKES)}</div>
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
                  <EngagementLine data={lineData} media="instagram"/>
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

export default instagram;
