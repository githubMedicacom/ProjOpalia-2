// react component used to create charts
// react plugin used to create DropdownMenu for selecting items

// react plugin that creates an input with badges
// react-bootstrap components
import { useEffect, useState } from "react";
import Configuration from "../../../configuration";
function Mapping() {
  const [loader, setLoader] = useState(true);
  const [iframe, setIframe] = useState(false);
  
  useEffect(() => {
    setTimeout(async () => {
      setLoader(false);
      setIframe(true);
    }, 5000);
  })
  return (
    <>
    {loader === true ? (
      <div id="loader" className="loader-container loader-iframe">
        <div className="loader"></div>
      </div>
    ) : ""}
    {iframe === true ? (
      <div id="iframe">
        <iframe title="Transition" width="100%" height="630px" src={Configuration.mapping}></iframe>
     </div>
      ) : ""}
    </>
  );
}
export default Mapping;
