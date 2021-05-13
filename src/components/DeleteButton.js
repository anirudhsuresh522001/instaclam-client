import React,{useState} from "react";
import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";
import {Button,Confirm,Icon} from "semantic-ui-react"; 
import {FETCH_POSTS_QUERY} from "../util/graphql";
import MyPopup from "../util/MyPopup";




function DeleteButton({postID,commentID,callback}){

    const [confirmOpen,setConfirmOpen]=useState(false);

    const mutation=commentID?DELETE_COMMENT_MUTATION:DELETE_POST_MUTATION;
    const [deletePostOrMutation]=useMutation(mutation,{
        update(proxy){

            setConfirmOpen(false);
            if(!commentID)
            {
                const data=proxy.readQuery({
                query:FETCH_POSTS_QUERY
            });
            proxy.writeQuery({query:FETCH_POSTS_QUERY,data:{
               getPosts: data.getPosts.filter((p)=>p.id !== postID)}
            });
            }
            
            if(callback) callback();

        },
        variables:{
            postID,
            commentID
        }
    });

    return(
        <>
        <MyPopup content={commentID?"Delete Comment":"Delete Post"}>
            
            <Button as="div" color="red" onClick={()=>setConfirmOpen(true)} floated="right">
                <Icon name="trash" style={{margin:0}}/>
            </Button>
        
        </MyPopup>
        

    
    <Confirm 
    open={confirmOpen}
    onCancel={()=>setConfirmOpen(false)}
    onConfirm={deletePostOrMutation}
    />
    </>
    
    )
      
}


const DELETE_POST_MUTATION=gql`
    mutation deletePost($postID:ID!)
    {
        deletePost(postID:$postID)
    }

`;


const DELETE_COMMENT_MUTATION=gql`
    mutation deleteComment($postID:ID!,$commentID:ID!){
        deleteComment(postID:$postID,commentID:$commentID)
        {
            id
            comments{
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }

`


export default DeleteButton;