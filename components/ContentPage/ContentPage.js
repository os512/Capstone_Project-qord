// /components/ContentPage.js
import AuthButton from "@components/AuthButton/AuthButton.js";

import { maintitle, description } from "@styles/Content.module.css";

const ContentPage = ({ tonic, mode, scaleInfo, session }) => {
  if (session) {
    return (
      <>
        <h1 className={maintitle}>
          The {tonic} {`${mode[0].toUpperCase()}${mode.slice(1)}`} Scale
        </h1>
        <p className={description}>{scaleInfo.description}</p>
      </>
    );
  }
  return (
    <>
      <h1 className={maintitle}>You are not logged in!</h1>
      <AuthButton href="/getting-started">SignUp</AuthButton>
    </>
  );
};

export default ContentPage;
