import React, { Component } from "react";
import isEmpty from "../../Validation/isEmpty";

class ProfileHeader extends Component {
  render() {
    const { profile } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img
                  className="rounded-circle"
                  src={profile[0].user.avatar}
                  alt=""
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile[0].user.name}</h1>
              <p className="lead text-center">
                {profile[0].status}{" "}
                {isEmpty(profile[0].company) ? null : (
                  <span>at {profile[0].company}</span>
                )}
              </p>
              {isEmpty(profile[0].location) ? null : <p>{profile[0].location}</p>}
              <p>
                {isEmpty(profile[0].website) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile[0].website}
                    target="_blank"
                  >
                    <i className="fas fa-globe fa-2x" />
                  </a>
                )}

                {isEmpty(
                  profile[0].social && profile[0].social.twitter
                ) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile[0].social.twitter}
                    target="_blank"
                  >
                    <i className="fab fa-twitter fa-2x" />
                  </a>
                )}

                {isEmpty(
                  profile[0].social && profile[0].social.facebook
                ) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile[0].social.facebook}
                    target="_blank"
                  >
                    <i className="fab fa-facebook fa-2x" />
                  </a>
                )}

                {isEmpty(
                  profile[0].social && profile[0].social.linkedin
                ) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile[0].social.linkedin}
                    target="_blank"
                  >
                    <i className="fab fa-linkedin fa-2x" />
                  </a>
                )}

                {isEmpty(
                  profile[0].social && profile[0].social.youtube
                ) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile[0].social.youtube}
                    target="_blank"
                  >
                    <i className="fab fa-youtube fa-2x" />
                  </a>
                )}

                {isEmpty(
                  profile[0].social && profile[0].social.instagram
                ) ? null : (
                  <a
                    className="text-white p-2"
                    href={profile[0].social.instagram}
                    target="_blank"
                  >
                    <i className="fab fa-instagram fa-2x" />
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileHeader;
