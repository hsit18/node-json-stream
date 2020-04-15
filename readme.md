## Application folder details
1. Complete UI is in client folder
2. Keep json files in data folder on root.

## For Server Setup, run below commands on application root
1. npm install
2. npm run build:server
3. npm run start:server will start the app on localhost with 3001 port. (Wait for server to parse all json files. "parsing end" will be seen in console)

## For Client Setup, run below commands on application root/client
1. npm install
2. npm run start will start the app on localhost with 3000 port (open in browser : http://localhost:3001)

## UI Features: 
1. List of posts with comments.
2. Users can vote to posts/comments. Votes count updated and posts/comments re-sorted again.

## Backend API's:
1. `GET` http://localhost:3001/top
2. `POST` http://localhost:3001/upvote/{:id}
3. `POST` http://localhost:3001/downvote/{:id}

## test cases implemented for backend API
1. start the backend server one of the terminal at http://localhost:3001
2. npm run test. Test all 3 API endpoint with current json data.
