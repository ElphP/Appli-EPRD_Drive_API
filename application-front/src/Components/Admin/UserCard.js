import "./UserCard.css";

import img_portrait from "../../images/image-portrait-solid.svg";

const UserCard = ({ alias, id, titres }) => {
    
    return (
        <>
            <div className="userCard" id={id}>
                <img src={img_portrait} alt="UserCard" draggable="false"/>
                <p>{alias}</p>
            </div>
            <div className="popup" id={"popup" + id}>
                <ul>
                    {titres.map((titre) => {
                        return <li draggable="true" >{titre}</li>;
                    })}
                </ul>
            </div>
        </>
    );
};

export default UserCard;
