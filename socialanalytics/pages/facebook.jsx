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
import { FacebookProfiles } from "../data/FacebookProfiles";
import { useLogin } from "../context/UserContext";
import Router from "next/router";

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

const facebook = () => {
  const { user } = useLogin();

  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date().setMonth(new Date().getMonth()-3));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedProfile, setSelectedProfile] = useState(FacebookProfiles[0]);
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
    share : {},
    total : {},
    label : []
  });
  const [activeTab, setActiveTab] = useState("positive");
  const [tableData, setTableData] = useState();

  useEffect(() => {
    if(!user){
      Router.push("/login");
    }
  }, [user])

  // useEffect(() => {
  //   APICall.getFacebookEngagements()
  //     .then((response) => {
  //       setTableData(response);
  //     })
  // }, [setTableData])
  
  useEffect(() => {
    setLoading(true);

    APICall.getFacebookProfile(selectedProfile.value)
      .then((response) => {
        setProfile(response);
      })

    APICall.getFacebookPosts(selectedProfile.value)
      .then((response) => {
        let result = Array.isArray(response) && response.filter((response) => new Date(response.created_at) >= startDate && new Date(response.created_at) <= endDate);
        result = Array.isArray(result) && result.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
        setPosts(result);
      })

    APICall.getFacebookComments(selectedProfile.value)
      .then((response) => {
        setComments(Array.isArray(response) && response.filter((response) => new Date(response.comment_time) >= startDate && new Date(response.comment_time) <= endDate));
        setLoading(false);
      })

  }, [selectedProfile, startDate, endDate, setTableData, setProfile, setPosts, setComments, setLoading])

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
      obj["FAVORITES"] = (obj["FAVORITES"] || 0) + v.likes_count + v.loves_count;
      return obj;
    }, {});

    let favorite = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.created_at);
      date = date.toDateString();
      let index = obj.findIndex(item => item.x === date);
      let value = v.likes_count + v.loves_count;
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + value;
      } else{
        let object = {};
        object["x"] = date;
        object["y"] = value;
        obj.push(object);
      }
      return obj;
    }, []);

    let comment = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.created_at);
      date = date.toDateString();
      let index = obj.findIndex(item => item.x === date);
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + v.comments_count;
      } else{
        let object = {};
        object["x"] =  date;
        object["y"] = v.comments_count;
        obj.push(object);
      }
      return obj;
    }, []);

    let share = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.created_at);
      date = date.toDateString();
      let index = obj.findIndex(item => item.x === date);
      if(index !== -1){
        obj[index]["y"] = obj[index]["y"] + v.shares_count;
      } else{
        let object = {};
        object["x"] =  date;
        object["y"] = v.shares_count;
        obj.push(object);
      }
      return obj;
    }, []);

    let total = Array.isArray(posts)  && posts.reduce((obj,v) => {
      let date = new Date(v.created_at);
      date = date.toDateString();
      let value = v.likes_count + v.loves_count + v.comments_count + v.shares_count;
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
      share: share,
      total: total,
      label: label
    });

  }, [comments, posts])

  if(loading){
    return(
      <Layout activePage="facebook">
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
      <Layout activePage="facebook">
        {/* <h1>Facebook</h1> */}
        <section className="grid grid-cols-12">
          <div className="col-start-9 col-span-3">
            <Select 
                options={FacebookProfiles}
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
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
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Likes</div>
              <div className="stat-value">{profile.likes === null ? "-" : formatNumber(profile.likes)}</div>
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
                <div className="col-span-6 mr-5">
                  <h5>Engagement Rate Analysis</h5>
                  <EngagementLine data={lineData} media="facebook"/>
                </div>
                <div className="col-span-6 ml-5">
                  <h5>Significant Variables</h5>
                  <div className="tabs">
                    <a className={activeTab === "positive" ? "tab tab-bordered tab-active" : "tab tab-bordered"} onClick={() => {setActiveTab("positive")}}>Positive</a>
                    <a className={activeTab === "negative" ? "tab tab-bordered tab-active" : "tab tab-bordered"} onClick={() => {setActiveTab("negative")}}>Negative</a>
                  </div>
                  <div className="tab-content">
                    {/* <Table data={tableData} activeTab={activeTab} rowsPerPage={4}/> */}
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

export default facebook;
