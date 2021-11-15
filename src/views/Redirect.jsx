import './Redirect.css';
import { decodeState } from '../utils/state.js';
import i18n from 'i18next';

function Redirect(props) {
  
  const oauthResponseParams = props.oauthResponseParams;
  
  const oauthCode = oauthResponseParams.get("code");
  const state = decodeState(oauthResponseParams.get("state"));
  
  // If the callback doesn't have a state, then OAuth request wasn't initiated
  // by the MBO but by a developer who wants to manually generate a token.
  if (!state.shopRedirectUri) {
    return (<TokenGenerationSnippet oauthCode={ oauthCode } />);
  }
  
  var redirectParams = new URLSearchParams();
  redirectParams.set('state', state.shopRedirectUri);
  redirectParams.set('code', oauthResponseParams.get('code'));
  redirectParams.set('scope', oauthResponseParams.get('scope'));
  redirectParams.set('prompt', oauthResponseParams.get('prompt'));
  
  // TODO: Consider if we should test whether systemRedirectUri already contains a '?'.
  const returnUrl = state.systemRedirectUri + '&' + redirectParams.toString();
  
  console.log("return url: " + returnUrl);
  
  return (
    <div className="App">

      <nav className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm" id="mainNav">
      		<div className="container px-5">
      				<img src={process.env.PUBLIC_URL + '/img/Epages_Logo.png'} style={{ maxWidth: '200px' }} />
      		</div>
      </nav>

      <header className="masthead">
      		<div className="container px-5">
      				<div className="row gx-5 align-items-center">
      					<div className="col-lg-12">
      							<div className="mb-7 mb-lg-0 text-center text-lg-start">
      									<h1 className="display-4 lh-4 mb-6">
                          { i18n.t('views.callback.heading.label') }
                        </h1>
      									<p className="lead fw-normal text-muted mb-5">
      										{ i18n.t('views.callback.redirectionMessage.label') }
      									</p>
                        <p>
                          <a href={ returnUrl }>
                            <button type="button" className="btn btn-primary">
                              { i18n.t('views.callback.redirectNowButton.label') }
                            </button>
                          </a>
                        </p>
      							</div>
      					</div>
      				</div>
      		</div>
      </header>

      <footer className="bg-black text-center py-5">
      	<div className="container px-5">
      			<div className="text-white-50 small">
      					<div className="mb-2">{ i18n.t('views.homepage.legal.copyrightNotice.label') }</div>
      					<a href={ i18n.t('views.homepage.legal.imprintLink.label') }>{ i18n.t('views.homepage.legal.imprint.label') }</a>
      			</div>
      	</div>
      </footer> 

    </div>
  );
}

function TokenGenerationSnippet(props) {
  const baseUrl = window.location.href.replace(/\/\?.*/g, '');
  const curlSnippet =  `curl -X POST \\
  -F 'code=${props.oauthCode}' \\
  -F 'client_id='$GOOGLE_CLIENT_ID \\
  -F 'client_secret='$GOOGLE_CLIENT_SECRET \\
  -F 'redirect_uri=${baseUrl}' \\
  -F 'access_type=offline' \\
  -F 'grant_type=authorization_code' \\
  https://accounts.google.com/o/oauth2/token
  `;
  
  return (
    <div className="App">
      <h1>Authentication successful</h1>
      <textarea id="w3review" name="w3review" rows="10" cols="100">
        { curlSnippet }
      </textarea>
    </div>
  );
}

function _buildTokenGenerationSnippet(oauthCode) {

}

export default Redirect;