import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../User/User";
import styles from "./Comment.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navigate } from "react-router-dom";
import { format } from "date-fns";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function Comment({ select }) {
    const user = useContext(UserContext);
    const [comment, setComment] = useState("");
    const [content, setContent] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const [editId, setEditId] = useState(null);

    const time = format(new Date(), "hh:mm dd/MM/yyyy");

    async function handelComment() {
        if (user.user) {
            await axios.post("http://localhost:6060/comment", { comment, user: user.user, time, select });
            setComment("");
            fetchComments();
        } else {
            setRedirect(true);
        }
    }

    async function handelDelete(id) {
        await axios.delete(`http://localhost:6060/delete/${id}`);
        fetchComments();
    }

    async function handelEdit(id) {
        const res = await axios.get("http://localhost:6060/comment");
        const data = res.data.find((item) => item._id === id);
        setComment(data.content);
        setEditId(id); 
    }

    async function completeUpdate(id) {
        await axios.put("http://localhost:6060/comment", { content: comment, id });
        setEditId(null); 
        setComment("");
        fetchComments();
    }

    async function fetchComments() {
        const res = await axios.get("http://localhost:6060/comment");
        const data = res.data.filter((item) => item.bookingId === select);
        setContent(data);
    }

    useEffect(() => {
        fetchComments();
    }, [select]);

    if (redirect) {
        return <Navigate to={"/login"} />;
    }

    return (
        <div className={cx("comment")}>
            <div className={cx("input")}>
                <p>Viết bình luận của bạn</p>
                <input value={comment} onChange={(e) => setComment(e.target.value)} type="text" />
                {editId == null ?
                
                <button className={cx("btn")} onClick={handelComment}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
                :
                 ''
                }
            </div>

            {content.length > 0 &&
                content.map((item) => (
                    <div key={item._id} className={cx("wrap-comment")}>
                        <div className={cx("wrapper")}>
                            <div className={cx("wrap-avatar")}>
                                <img className={cx("avatar")} src={`http://localhost:6060/${item.user.avatar}`} alt="" />
                            </div>
                            <div className={cx("info")}>
                                <div className={cx("name")}>{item.user.name}</div>
                                <div className={cx("content")}>{item.content}</div>
                                <div className={cx("time")}>
                                    <p>Lúc {item.time}</p>
                                </div>
                            </div>
                        </div>

                        {user.user && user.user._id === item.user._id && (
                            <div>
                                <button className={cx("btn-options")} onClick={() => handelDelete(item._id)}>
                                    Xoá
                                </button>
                                <button className={cx("btn-options")} onClick={() => handelEdit(item._id)}>
                                    Sửa
                                </button>

                                {editId === item._id && (
                                    <button className={cx("btn-options")} onClick={() => completeUpdate(item._id)}>
                                        Update
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
}

export default Comment;
