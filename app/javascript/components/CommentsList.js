import React from "react";
import PropTypes from "prop-types";

import { makeDeepCopy } from "./helpers";

import Comment from "./Comment";
import CommentForm from "./CommentForm";
import CommentToolbarButton from "./CommentToolbarButton";

const CommentsList = ({
  commentFormsVisibility,
  comments,
  handleDeleteComment,
  handleFormVisibilityToggle,
  handleFormSubmit,
  handleTextAreaChange,
  setTextAreaValues,
  textAreaValues
}) => {
  // this takes an array of comment JSON, then returns a list of React <Comment /> components
  // replies are nested within parent <Comment /> components
  const generateCommentComponents = (commentsArray) => {
    return commentsArray.map((comment) => {
      // these props are common to all forms
      const commentFormProps = {
        commentId: comment.commentId,
        handleFormSubmit,
        handleTextAreaChange
      }
  
      // each comment comes with in a edit comment form
      const editFormId = "edit-" + comment.commentId;
      const editCommentForm = <CommentForm 
        commentFormType="edit"
        commentId={comment.commentId}
        formId={editFormId}
        textAreaValue={textAreaValues[editFormId]}
        {...commentFormProps}
      />;
  
      // each comment comes with a button to toggle edit form visible
      const toggleEditButton = <CommentToolbarButton 
        icon={<i className="fa fa-pencil"></i>}
        onClick={() => handleFormVisibilityToggle("edit-" + comment.commentId)}
      />;
  
      // and a delete button
      const deleteButton = <CommentToolbarButton
        icon={<i className='icon fa fa-trash'></i>}
        onClick={() => handleDeleteComment(comment.commentId)}
      />;
  
      const replyFormId = "reply-" + comment.commentId;
      let replies = [];
      let replyCommentForm = null;
      
      if (!comment.replyTo) {
        // if the comment is NOT a reply to another comment, then it's a top-level comment
        // that means it comes with a reply form.
        replyCommentForm = <CommentForm
          commentId={comment.commentId}
          commentFormType="reply"
          formId={replyFormId}
          textAreaValue={textAreaValues[replyFormId]}
          {...commentFormProps}
        />;
      }

      // if comment has replies...
      if (comment.replies && comment.replies.length) {
        // recursively generate <Comment> components for the comment's replies
        replies = generateCommentComponents(comment.replies);
      }

      return (
        <Comment 
          key={"comment-" + comment.commentId} 
          comment={comment}
          deleteButton={deleteButton}
          editCommentForm={editCommentForm}
          handleFormVisibilityToggle={handleFormVisibilityToggle}
          isEditFormVisible={commentFormsVisibility[editFormId]}
          isReplyFormVisible={comment.replyTo ? null : commentFormsVisibility[replyFormId]}
          replyCommentForm={replyCommentForm}
          setTextAreaValues={setTextAreaValues}
          toggleEditButton={toggleEditButton}
        >
          {replies}
        </Comment>
      );
    });
  }

  // here we "nest" the reply comments inside of their parent comments
  const newComments = makeDeepCopy(comments);

  // start by filtering out are parent comments (comments that can take replies)
  let parentComments = newComments
    .filter((comment) => !comment.replyTo)
    .map((comment) => {
      comment.replies = [];
      return comment;
    });

  // make a separate array of all comments that are replies
  let replies = newComments.filter((comment) => comment.replyTo);

  // then nest all those replies into their parent comment
  for (let i = 0; i < replies.length; i++) {
    for (let j = 0; j < parentComments.length; j++) {
      if (parentComments[j].commentId === replies[i].replyTo) {
        parentComments[j].replies.push(replies[i]);
      }
    }
  }

  // now that comments are nested, generate all comment components for display
  const commentComponentsList = generateCommentComponents(parentComments);

  return (
    <div id="comments-list" style={{ marginBottom: "50px" }}>
      {commentComponentsList}
    </div>
  );
};

CommentsList.propTypes = {
  commentFormsVisibility: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  handleDeleteComment: PropTypes.func.isRequired,
  handleFormVisibilityToggle: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  handleTextAreaChange: PropTypes.func.isRequired,
  setTextAreaValues: PropTypes.func.isRequired,
  textAreaValues: PropTypes.object.isRequired
};

export default CommentsList;
