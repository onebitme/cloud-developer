import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import validUrl from 'valid-url';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get("/filteredimage/", async (req, res) => {
    let { image_url } = req.query
    //Check if there is any url at all
    if (!image_url) {
      console.error('No image url')
      return res.status(422).send({ error: 'Please provide an image url' })
    }
    if (!validUrl.isUri(image_url)) {
      console.error(image_url)
      return res.status(415).send({ error: 'Please provide a valid Image Url' })
    }else{
      console.error('url is valid')
      try {
        let image_response = await filterImageFromURL(image_url)
        // if image reader does not fail return image else return error
        if(image_response != "no image found"){
          res.status(200).sendFile(image_response, async callback=>{
            await deleteLocalFiles([image_response])
          })
        } else {
          res.status(200).send("There is no image in that url")
        }
      } catch (err) {
        // other errors
        console.error(err)
        res.status(200).send("image processing failed")
      }

    }


  });

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();