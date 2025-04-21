import type { ContactRecord } from "app/data";
import { Form } from "react-router";



export default function Contact() {
  const contact = {
    first: 'John',
    last: 'Doe',
    avatar: 'https://placecats.com/200/200',
    twitter: 'johndoe',
    notes: 'This is a note',
    favorite: true,
  }
  return (
    <div id="contact">
      <img
        key={ contact.avatar }
        src={ contact.avatar }
        alt={ `Avatar of ${contact.first} ${contact.last}` }
      />
      <div>
        <h1>
          { contact.first || contact.last
            ? (<>{ contact.first } { contact.last }</>)
            : (<i>No Name</i>)
          }
          <Favorite contact={ contact } />
        </h1>

        { contact.twitter ? (
          <p>
            <a
              href={ `https://twitter.com/${contact.twitter}` }
            >
              { contact.twitter }
            </a>
          </p>
        ) : null }

        { contact.notes ? <p>{ contact.notes }</p> : null }

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={ (event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            } }
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: Pick<ContactRecord, "favorite"> }) {
  const favorite = contact.favorite;
  return (
    <Form method="post">
      <button
        aria-label={ favorite ? "Remove from favorites" : "Add to favorites" }
        name="favorite"
        value={ favorite ? "false" : "true" }>
        { favorite ? "★" : "☆" }
      </button>
    </Form>
  )
}