import express from 'express';
import bodyParser from 'body-parser';
import { Response, Request } from 'express'
import { filterImageFromURL, deleteLocalFiles, isValidURL } from './util/util';
import path from 'path';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const image_url = req.query.image_url;

    if (image_url && isValidURL(image_url)) {
      const filteredImage: string = await filterImageFromURL(image_url)

      res.status(200).sendFile(filteredImage, async (err) => {
        if (err) console.error(err)
        await deleteLocalFiles([filteredImage]);
      });
    } else {
      res.status(400).send('Image url is not specified');
    }
  })

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