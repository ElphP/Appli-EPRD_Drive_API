import "./UserCard.css";

import img_portrait from "../../images/image-portrait-solid.svg";

const UserCard = ({ alias, id, titres, onDragStartUserDocFnct }) => {
    return (
        <>
            <div className="userCard" id={id} draggable="true">
                <img src={img_portrait} alt="UserCard" draggable="false" />
                <p>{alias}</p>
            </div>
            <div className="popup" id={"popup" + id}>
                <ul>
                    {titres.map((titre) => {
                        return <li draggable="true" onDragStart={(event)=>onDragStartUserDocFnct(titre,id,event)}>{titre}</li>;
                    })}
                </ul>
            </div>
        </>
    );
};

export default UserCard;
