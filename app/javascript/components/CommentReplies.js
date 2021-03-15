import React from "react";
import PropTypes from "prop-types";

const CommentReplies = ({
  children,
  commentId,
  isReplyFormVisible,
  handleReplyFormToggle,
  replyCommentForm
}) => {
  const replyToggleLink = <p
    id={"comment-" + commentId + "-reply-toggle"}
    onClick={() => handleReplyFormToggle("reply-" + commentId)}
    style={{
      color: "#006dcc",
      cursor: "pointer",
      userSelect: "none"
    }}
  >
    Reply to this comment...
  </p>;
  // placeholder: link to login if no currentUser

  const replyForm = isReplyFormVisible ?
    replyCommentForm :
    "";

  return (
    <>
      {children}
      {replyToggleLink}
      {replyForm}
    </>
  );
}

CommentReplies.propTypes = {
  children: PropTypes.array,
  commentId: PropTypes.number.isRequired,
  isReplyFormVisible: PropTypes.bool.isRequired,
  handleReplyFormToggle: PropTypes.func,
  replyCommentForm: PropTypes.element
}

export default CommentReplies;
