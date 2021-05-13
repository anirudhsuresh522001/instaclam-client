import React,{useContext,useState,useRef} from "react";
import gql from "graphql-tag";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {Button, Card, Grid, Icon, Label,Image, CardContent,Form} from "semantic-ui-react";
import moment from "moment"
import LikeButton from "../components/LikeButton";
import {AuthContext} from "../context/auth";
import DeleteButton from "../components/DeleteButton";
import MyPopup from "../util/MyPopup";


function SinglePost(props)
{
    const postID=props.match.params.postID;
    
    const {user}=useContext(AuthContext);


    const commentInputRef= useRef(null);
    const {data:{getPost}={}}=useQuery(FETCH_POST_QUERY,{
        variables:{
            postID
        }
    });


    const [comment,setComment]=useState("");
    const [submitComment]=useMutation(SUBMIT_COMMENT_MUTATION,{
        update(){
            setComment("");
            commentInputRef.current.blur();
        },
        variables:{
            postID,
            body:comment
        }
    });

function deletePostCallback()
{
    props.history.push("/");
}

    let postMarkup;
    if(!getPost)
    {
        postMarkup=<p>Loading Post...</p>
    }
    else
    {
        const {id,body,createdAt,username,comments,likes,likeCount,commentCount}=getPost;
        postMarkup=(
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                     <Image src="https://react.semantic-ui.com/images/avatar/large/molly.png" 
                                    size="tiny"
                                    float="right"/>   
                    </Grid.Column>
                     <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id,likeCount,likes}}></LikeButton>
                                <MyPopup content="Comment on Post">
                                    <Button as="div" labelPosition="right">
                                        <Button basic color="blue">
                                            <Icon name="comments"></Icon>
                                        </Button>
                                        <Label basic color="blue" pointing="left">
                                            {commentCount}
                                        </Label>
                                    </Button>
                                </MyPopup>
                                        {user && user.username===username && (
                                            <DeleteButton postID={id} callback={deletePostCallback}/>
                                        )}
                                    
                                    
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                <Form>
                                    <div className="ui action input fluid">
                                        <input 
                                        type="text"
                                        placeholder="comment.."
                                        name="comment"
                                        value={comment}
                                        onChange={event=>setComment(event.target.value)}
                                        ref={commentInputRef}
                                        />
                                        <button 
                                        type="submit" 
                                        className="ui button blue" 
                                        disabled={comment.trim()===""}
                                        onClick={submitComment}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </Form>
                                </Card.Content>
                            </Card>
                        )}
                        
                        
                        {comments.map(comment=>(
                            
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username===comment.username &&
                                    <DeleteButton postID={id} commentID={comment.id}/> }
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                        
                    </Grid.Column>
                </Grid.Row>

            </Grid>
        )
    }
    return(postMarkup);

}


const SUBMIT_COMMENT_MUTATION=gql`
    mutation($postID:String!,$body:String!){
        createComment(postID:$postID,body:$body){
            id
            comments{
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY=gql`
query($postID:ID!)
{
    getPost(postID:$postID)
    {
        id
        body
        username
        createdAt
        likeCount
        likes{
            id
            username
            createdAt
        }
        commentCount
        comments{
            id
            username
            createdAt
            body
        }
    }
}
`

export default SinglePost;