import React from "react";
import Link from 'next/link'
import Image from "next/image";
import FriendListItem from "./FriendListItem";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Loadingspinner from "./Loadingspinner";


export default function FriendsList() {

  const router = useRouter();


// resolve following list as array of user IDs 
  // const userToken = localStorage.getItem("tokenKey")
  const [done, setDone] = useState(false)
 
const [followers, setFollowers] = useState()
let followerArray = []
let nameArray = []
const [username, setUsername] = useState([])
const [isLoaded, setIsLoaded] = useState(false)

 const getFollowerIds = function () {

      var token = (JSON.parse(localStorage.getItem("tokenKey").replaceAll("", '')))
      fetch('http://127.0.0.1:8000/connections/following/', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          },
      })
      .then(res => res.json())
      .then((data => data.map(object => followerArray.push(object.followee_id))))
      .then(() => setFollowers(followerArray))
      .then(() => setIsLoaded(true))
      
 
      .catch((error) => {
        console.error('Error:', error)})

}

      // .then(() => {followerArray.map(follower => fetch(`http://127.0.0.1:8000/users/${follower}/`, {
      //   method: 'GET',
      //   headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${token}`,
      //       },
      //   })
      //   .then(res => res.json())
      //   .then((data => nameArray.push(data.name))))})
      //   .then(() => setUsername(nameArray))
      //   .then(() => setIsLoaded(true))
      //   .then(console.log(nameArray))
      //   .then(console.log(followers))


      // .catch((error) => {
      //   console.error('Error:', error)})
      
      // }
      
     

     const getFollowerNames = async function () {
      var token = (JSON.parse(localStorage.getItem("tokenKey").replaceAll("", '')))
      const userFriends = [...username]
        await Promise.all(
        followers.map((follower) => 
        fetch(`http://127.0.0.1:8000/users/${follower}/`, 
        {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
          }
          ).then(res => res.json())
        ))
        .then(data => data.map(users => nameArray.push(users.username)))
        .then(() => setUsername(nameArray))

        }
        
          
        //  .then(data => nameArray.push(data.username))
        //  .then(console.log(nameArray))
           
      
          


        
        // nameArray.push(responses)
        // console.log(nameArray)
        
        

     

        // .then(res => res.json())
        // .then((data) => {return data.name})
        // })
        // )
        // console.log(responses)
      
// this runs first API fetch onMount which sets 'followers' state 
  useEffect(() => {
   
     getFollowerIds();
  
  }, [])

// onMount the funct wont fire due to if statement, second 
// execution will fire due to the 'followers' dependancey change?
  useEffect(() => {
      
      if(followers == undefined ){
        console.log('no followers');
        // getFollowerNames()
      
      }
      if(followers != undefined){
       
        getFollowerNames()
        

      }
    }, [followers])


    const rendernames = function() {
      if (username.length > 0){
       return username.map(user => (<FriendListItem key={user} UserName={user} link={`/usertree/${user}`}/>))}
       
      else { return <Loadingspinner className={styles.spinner}/>}
      
      }


    useEffect(() => {
      rendernames();
    
  }, [username])

  return (
    <div className={styles.sideContainer}>
        <div className={styles.search}>
            <div className={styles.inputview}>
              <input type="text"  className={styles.searchInput} name="Friendsearch" placeholder="Search connections..."/>
              <button type="submit" className={styles.searchButton}><Image src="/searchIcon.png" width={25} height={25}></Image></button>
            </div>
        </div>

        {rendernames()}
       
        {/* {isLoaded == true ? username && username.map(user => (<FriendListItem key={user} UserName={user} link = {`/user/${user}`}/>)) : <div>loading</div>} */}
        {/* {followers != undefined && followers.map(user => (<FriendListItem key={user} UserName={user} link={`/user/${user}`}/>))} */}
        {/* {username != undefined ? username.map(user => (<FriendListItem key={user} UserName={user} link={`/user/${user}`}/>)) : <div>no names</div>} */}

        {/* {isLoaded == true ? <div>hello</div> : <div>loading</div>} */}

    </div>
  )
}

const styles = {

    sideContainer: "xlg:block overflow-y-scroll h-[100vh] mb-96 mr-2 w-[25vw] bg-white border-slate-200 border-l-2 static right-0 top-25 xxs:hidden ",
    search: "flex border-b-2 w-contain py-6 h-contain justify-center  items-center align-center border-b",
    searchButton: "min-w-28 min-h-28 pr-2",
    searchInput: "w-full mx-2 rounded-lg p-2 bg-[#f4f4ef] h-10 ",
    inputview: "flex flex-row bg-[#f4f4ef] rounded-lg mx-6",
    spinner: "flex items-center w-2/2 border-2"

}
