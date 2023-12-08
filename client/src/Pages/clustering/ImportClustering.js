import React from "react";

// react-bootstrap components
import { clustringAdded } from "../../Redux/clustringReduce";
import NotificationAlert from "react-notification-alert";

import { useDispatch } from "react-redux";
function ImportClustering() {
  const notificationAlertRef = React.useRef(null);
  const notify = (place, msg, type) => {
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>{msg}</div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  const dispatch = useDispatch();
  /* const { entities } = useSelector((state) => state.users);
  console.log(entities) */
  /* const [files, setFiles] = useState(""); */
  const handleChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      var obj = JSON.parse(e.target.result);
      dispatch(clustringAdded(obj));
      notify("tr", "Importation avec succes", "success");
    };
  };
  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <h1>Import donnée de clustering</h1>

      <input type="file" onChange={handleChange} />
      <br />
    </>
  );
}

export default ImportClustering;
