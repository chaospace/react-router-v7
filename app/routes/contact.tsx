import { getContact, updateContact, type ContactRecord } from "../data";
import { Form, useFetcher } from "react-router";
import type { Route } from "./+types/contact";

export async function loader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contactId);
  return { contact }
}

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;
  if (!contact) {
    throw new Response("Contact not found", { status: 404 });
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
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post">
      <button
        aria-label={ favorite ? "Remove from favorites" : "Add to favorites" }
        name="favorite"
        value={ favorite ? "false" : "true" }>
        { favorite ? "★" : "☆" }
      </button>
    </fetcher.Form>
  )
}