# Water Mark Creator


 A very simple node app that watermarks an image and scales the image to a 400 x 400 png file.

# Tools
    - Babel 
    - mocha
    - chai

# Install
    yarn install

# Build App
    yarn test

# Run App
    yarn start

# Status Code responses
    200 ok

# End points 
    Resize image - http://localhost:3000/api/v1/resize
        - Method GET
        - send a pay load with --data 'imageurl=LINK_TO_IMAGE'
          e.g using curl: 
          
          curl --request GET -d 'imageurl=http://www.google.com/images/srpr/logo11w.png' --url  http://localhost:3000/api/v1/resize/  


    Water mark image - http://localhost:3000/api/v1/watermark
        - Method POST
        - send a payload with file having "key": 'image' using postman
          e.g Test using this url: http://localhost:3000/api/v1/test
           

    