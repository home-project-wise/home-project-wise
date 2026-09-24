# Pinterest OAuth Setup — One-Time Authorization

## One-time step

Authorize the Pinterest app once through Pinterest's OAuth Authorization Code flow and store the returned continuous refresh token as the GitHub Actions secret `PINTEREST_REFRESH_TOKEN`. Also store `PINTEREST_CLIENT_ID` and `PINTEREST_CLIENT_SECRET` as repository secrets.

The initial access token is not used as the long-term credential.

## Automatic operation

Every Pinterest publishing run exchanges `PINTEREST_REFRESH_TOKEN` for a fresh access token before publishing. The short-lived access token is passed only to the publishing step.

Pinterest documents 30-day access tokens and a continuous refresh-token window of 60 days; refreshing within that window keeps the authorization alive. If the refresh token is expired or revoked, a new OAuth authorization is required.

## Failure fallback

A failed refresh stops publishing safely. The workflow does not fall back to an old static access token.

## Security

Never commit Pinterest tokens or client secrets to the repository.

Official documentation:
https://developers.pinterest.com/docs/getting-started/set-up-authentication-and-authorization/
