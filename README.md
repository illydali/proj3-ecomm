
# The Vinyl Jukebox - Business Owner 

This is the backend admin page for e-commerce site **The Vinyl Jukebox**. Business owner is able to perform CRUD on products and track customer records and order information.
This app also hosts the API endpoints for the e-commerce site.

## Live Access 

Admin - https://illy-vinylshop.herokuapp.com/

#### Login Information


| Email | Password    |                
| :-------- | :------- | 
| `rotijohn@gemail.com` | `test1234` |  

E-commerce - https://the-vinyl-jukebox.netlify.app/

Please note that heroku will take up to 30 seconds to load.

Full readme can be found at https://github.com/illydali/proj3-ecomm-react

## Database Design
Usage of ORM libraries - db-migrate, Bookshelf, Knex 

- Database development done with MySQL in Gitpod. 
- Moved to Postgres after Heroku deployment. 

*One to many relationship*

Record to Artist

Record to Label

*Many to many relationship*

Record to Genres 

Cart to User and Record

Order to User and Record

#### Original design of the database before moving on to logical schema. 

Logical schema and complete readme of entire project can be found [here](https://github.com/illydali/proj3-ecomm-react)

![Original ERD](vinylshop_erd.png) 

## Technologies & Libraries Used
- NodeJS Framework
- Express 
- REST API
- Handlebars
- Bookshelf ORM
- Stripe
- Bootstrap 5
- Caolan Forms 
- Flash messages
- JSON Web Token & jwt-verify
- CORS
- CSURF
- Express-sessions and session-file-store
- momentjs

## Acknowlegements

Lecturer [Paul Chor](https://github.com/kunxin-chor) for imparting his skills.

TAs Ace, Haryati and Chen Yun for being patient and spending time to figure out our bugs.

The class of TGC16 for always being ready to share all knowledge, shortcuts and problem-fixes. 

*Data used in the development of this website is for educational purposes only and may or may not be accurate.*