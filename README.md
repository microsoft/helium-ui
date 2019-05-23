# Helium UI

Helium UI is a React application built in TypeScript created to test and display REST API endpoints. Helium UI's core functionality includes:
- Display all movies from endpoint (GET)
- Add a new movie to the list of movies (POST)
- Delete a movie from the list of movies (DELETE) - in progress

## Packages Used:
- Material UI - Styling of the application
- Axios - Performing CRUD requests and operations
- Formik - Handling state using React Forms and Dialogs
  

# Getting Started

## Run Locally with npm

1. Clone the repository
2. Open a terminal in the local respository directory
3. Run the application using
```
npm build && npm start
```

## Run Locally with Docker

1. Clone the repository
2. Open a terminal in the local repository directory
3. Build the application using
```
docker build -t helium-ui .
```
4. Run the application using
```
docker run -it -P helium-ui
```
In another terminal, run:
```
docker ps
```
Output will show the port number the image is running on:
```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                  
1dafc0296c23        helium-ui           "npm start"              24 seconds ago      Up 23 seconds       0.0.0.0:32770->3000/tcp
```
In a browser, navigate to `http://localhost:<port number from previous step>` and the Helium UI should appear.


## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
