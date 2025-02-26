import { useState } from "react";
import PropTypes from "prop-types";
import { MdComputer, MdPerson } from "react-icons/md";
import moment from "moment";
import Image from "./Image";
import Markdown from "./Markdown";

/**
 * A chat message component that displays a message with a timestamp and an icon.
 *
 * @param {Object} props - The properties for the component.
 */
const Message = (props) => {
  const { id, createdAt, text, ai = false, selected } = props.message;
   
  
  const [isExpanded, setIsExpanded] = useState(false);

  

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderContent = () => {
    // if (showSatisfactionPrompt) {
    //   return (
    //     <div className={`flex items-end my-4 gap-2 mb-3 ${ai ? "flex-row-reverse justify-end" : "flex-row justify-end"}`}>
    //       <div className={`w-screen overflow-hidden chat ${ai ? "chat-start" : "chat-end"}`}>
    //         <div className="chat-bubble text-neutral-content">
    //           <Markdown markdownText={text} />
    //           <div className={`${ai ? "text-left" : "text-right"} text-xs`}>
    //             {moment(createdAt).calendar()}
    //           </div>
    //           <div className="mt-3">
    //           <button className="btn btn-sm btn-[tranparent]  rounded-md border-1 border-slate-500 w-[3rem] m-2" onClick={() => handleSatisfaction(true)}>Yes</button>
    //           <button className="btn btn-sm btn-[tranparent] rounded-md border-1 border-slate-500 w-[3rem] m-2" onClick={() => handleSatisfaction(false)}>No</button>
    //         </div></div>
           
    //       </div>
    //       <div className="avatar">
    //       <div className="w-8 border rounded-full border-slate-400">
    //         {ai ? (
    //           <MdComputer className="w-6 h-full m-auto" />
    //         ) : (
    //           <MdPerson className="w-6 h-full m-auto" />
    //         )}
    //       </div>
    //     </div>
    //     </div>
    //   );
    // }

    const maxLength = 400; // Maximum number of characters to show before truncating

    return (
      <div className={`flex items-end my-2 gap-2 ${ai ? "flex-row-reverse justify-end" : "flex-row justify-end"}`}>
        {selected === "DALL·E" && ai ? (
          <Image url={text} />
        ) : (
          <div className={`w-screen overflow-hidden chat ${ai ? "chat-start" : "chat-end"}`}>
            <div className="chat-bubble text-neutral-content">
              <Markdown markdownText={isExpanded || text.length <= maxLength ? text : `${text.substring(0, maxLength)}`} />
              {text.length > maxLength && (
                <button className="text-xs text-blue-500" onClick={toggleExpand}>
                  {isExpanded ? "Show Less" : "...Read More"}
                </button>
              )}
              <div className={`${ai ? "text-left" : "text-right"} text-xs`}>
                {moment(createdAt).calendar()}
              </div>
            </div>
          </div>
        )}

        <div className="avatar">
          <div className="w-8 border rounded-full border-slate-400">
            {ai ? (
              <MdComputer className="w-6 h-full m-auto" />
            ) : (
              <MdPerson className="w-6 h-full m-auto" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
};

export default Message;

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    createdAt: PropTypes.number.isRequired,
    text: PropTypes.string,
    ai: PropTypes.bool,
    selected: PropTypes.string
   
  }).isRequired,
  
};
