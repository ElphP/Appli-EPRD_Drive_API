import "./UserCard.css";

import img_portrait from "../../images/image-portrait-solid.svg";

const UserCard = ({ alias, id, userId, titres, onDragStartUserDocFnct }) => {
  
    return (
        <>
            <div
                className="userCard"
                id={id}
                draggable="true"
                data-alias={alias}
                data-userid={userId}               
            >
                <img src={img_portrait} alt="UserCard" draggable="false" />
                <p>{alias}</p>
            </div>
            <div className="popup" id={"popup" + id}>
                <ul>
                    
                    
                    {titres.map((titre) => {
                       
                       
                        
                        return (
                            <li
                                draggable="true"
                                onDragStart={(event) =>
                                    onDragStartUserDocFnct(titre[0], userId, alias, titre[1],  event)
                                }
                                key={alias + titre}
                            >
                                {titre[0]}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
};

export default UserCard;
