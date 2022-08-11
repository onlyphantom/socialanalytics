import { useEffect, useState } from "react";
import Select from "react-select";
import { BarLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";

import Router from "next/router";
import Image from "next/image";

import Layout from "../components/Layout";
import DonutPercent from "../components/DonutPercent";
import EngagementLine from "../components/EngagementLine";
import Table from "../components/Table";

import APICall from "../APICall";
import { useLogin } from "../context/UserContext";
import { YoutubeProfiles } from "../data/YoutubeProfiles";
import { format } from "date-fns";
import id from "date-fns/locale/id";
registerLocale("id", id);
import "react-datepicker/dist/react-datepicker.css";

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

const youtube = () => {
  const { user } = useLogin();

  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date().setMonth(new Date().getMonth()-3));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedProfile, setSelectedProfile] = useState(YoutubeProfiles[0]);
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
    view : {},
    total : {},
    label : []
  });
  const [activeTab, setActiveTab] = useState("positive");
  const [tableData, setTableData] = useState();

  useEffect(() => {
    if(!user){
      if(!localStorage.getItem("BIAuthTokens")){
        Router.push("/login");
      }
    }
  }, [user]);
  
  useEffect(() => {
    APICall.getYoutubeEngagements()
      .then((response) => {
        setTableData(response);
      })
  }, []);

  useEffect(() => {
    setLoading(true);

    APICall.getYoutubeProfile(selectedProfile.value)
      .then((response) => {
        setProfile(response);
      })

    APICall.getYoutubePosts(selectedProfile.value)
      .then((response) => {
        let result = Array.isArray(response) && response.filter((response) => new Date(response.publishedat) >= startDate && new Date(response.publishedat) <= endDate);
        result = Array.isArray(result) && result.sort((a,b) => new Date(a.publishedat) - new Date(b.publishedat));
        setPosts(result);
      })

    APICall.getYoutubeComments(selectedProfile.value)
      .then((response) => {
        setComments(Array.isArray(response) && response.filter((response) => new Date(response.publishedat) >= startDate && new Date(response.publishedat) <= endDate));
        setLoading(false);
      })

  }, [selectedProfile, startDate, endDate, setProfile, setPosts, setComments, setLoading]);

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
      obj["LIKES"] = (obj["LIKES"] || 0) + v.likecount;
      return obj;
    }, {});

    let like = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.publishedat);
      date = date.toDateString();
      let index = obj.findIndex(item => item.x === date);
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + v.likecount;
      } else{
        let object = {};
        object["x"] = date;
        object["y"] = v.likecount;
        obj.push(object);
      }
      return obj;
    }, []);

    let comment = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.publishedat);
      date = date.toDateString();
      let index = obj.findIndex(item => item.x === date);
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + v.commentcount;
      } else{
        let object = {};
        object["x"] =  date;
        object["y"] = v.commentcount;
        obj.push(object);
      }
      return obj;
    }, []);

    let view = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.publishedat);
      date = date.toDateString();
      let index = obj.findIndex(item => item.x === date);
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + v.viewcount;
      } else{
        let object = {};
        object["x"] =  date;
        object["y"] = v.viewcount;
        obj.push(object);
      }
      return obj;
    }, []);

    let total = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.publishedat);
      date = date.toDateString();
      let value = v.likecount + v.commentcount + v.viewcount;
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
      let date = new Date(v.publishedat);
      date = date.toDateString();
      obj.push(date);
      return obj;
    }, []);

    label = Array.isArray(label) && Array.from(new Set(label));
    
    setAggregate({
      engagement_count: engagements,
      sentiment_count: sentiments
    });

    setLineData({
      like: like,
      comment: comment,
      view: view,
      total: total,
      label: label
    });

  }, [comments, posts]);

  if(loading){
    return(
      <Layout activePage="youtube">
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
      <Layout activePage="youtube">
        <section className="grid grid-cols-12">
          <div className="col-start-9 col-span-3">
            <Select 
                options={YoutubeProfiles}
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
                  />
                </svg>
              </div>
              <div className="stat-title">Subscribers</div>
              <div className="stat-value">{ profile.subscribercount === null ? "-" : formatNumber(profile.subscribercount) }</div>
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
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="stat-title">Views</div>
              <div className="stat-value">{ profile.viewcount === null ? "-" : formatNumber(profile.viewcount) }</div>
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
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <div className="stat-title">Videos</div>
              <div className="stat-value">{ profile.videocount === null ? "-" : formatNumber(profile.videocount) }</div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-12 my-5">
          <div className="col-span-4">
            <h5>Comments' Sentiment Analysis</h5>
          </div>
          <div className="col-start-7 col-span-5 flex gap-x-2 max-w-xs">
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
                      <div className="stat-value">{aggregate.engagement_count.LIKES ? formatNumber(aggregate.engagement_count.LIKES) : "-"}</div>
                      <div className="stat-desc">
                        {format(startDate, "MMMM do, yyyy")} -
                        {format(endDate, "MMMM do, yyyy")}
                      </div>
                    </div>
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
                <EngagementLine data={lineData} media="youtube"/>
              </div>
              <div className="col-span-6 ml-5">
                <h5>Significant Variables</h5>
                <div className="tabs">
                  <a className={activeTab === "positive" ? "tab tab-bordered tab-active" : "tab tab-bordered"} onClick={() => {setActiveTab("positive")}}>Positive</a>
                  <a className={activeTab === "negative" ? "tab tab-bordered tab-active" : "tab tab-bordered"} onClick={() => {setActiveTab("negative")}}>Negative</a>
                </div>
                <div className="tab-content">
                  <Table data={tableData} activeTab={activeTab} rowsPerPage={4}/>
                </div>
              </div>
            </section>
          ) : (
            <>
              <section className="grid grid-cols-12 my-5">
                <div className="col-span-6">
                  <h5>Engagement Rate Analysis</h5>
                  <div className="stat-title my-5">No posts available.</div>  
                </div>
                <div className="col-span-6 ml-5">
                  <h5>Significant Variables</h5>
                  <div className="tabs">
                    <a className={activeTab === "positive" ? "tab tab-bordered tab-active" : "tab tab-bordered"} onClick={() => {setActiveTab("positive")}}>Positive</a>
                    <a className={activeTab === "negative" ? "tab tab-bordered tab-active" : "tab tab-bordered"} onClick={() => {setActiveTab("negative")}}>Negative</a>
                  </div>
                  <div className="tab-content">
                    <Table data={tableData} activeTab={activeTab} rowsPerPage={4}/>
                  </div>
                </div>
              </section>
            </>
          )
        } 
      </Layout>
    );
  };
};

export default youtube;
