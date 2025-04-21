import { Outlet, Link, Form, NavLink, useNavigation, useSubmit } from "react-router";
import { getContacts } from "../data";
import type { Route } from "./+types/sidebar";
import { useEffect } from "react";


export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts, q } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSearching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q") as HTMLInputElement;
    if (searchField) {
      searchField.value = q || '';
    }
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1><Link to="about">React Router Contacts</Link></h1>
        <div>
          <Form id="search-form" role="search" onChange={ (event) => {
            const isFirstSearch = q === null;
            console.log('value', q);
            submit(event.currentTarget, { replace: !isFirstSearch })
          } }>
            <input
              aria-label="Search contacts"
              id="q"
              name="q"
              className={ isSearching ? 'loading' : '' }
              placeholder="Search"
              defaultValue={ q || '' }
              type="search"
            />
            <div aria-hidden hidden={ !isSearching } id="search-spinner" />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          { contacts.length ?
            (
              <ul>
                { contacts.map((contact: any) => {
                  return (
                    <li key={ contact.id }>
                      <NavLink className={ ({ isActive, isPending }) => {
                        return isActive ? "active" : isPending ? "pending" : ""
                      } } to={ `/contacts/${contact.id}` }>
                        {
                          contact.first || contact.last ? (
                            <>{ contact.first } { contact.last }</>
                          ) : (<i>No Name</i>)
                        }
                        { contact.favorite && (
                          <span>★</span>
                        ) }
                      </NavLink>
                    </li>
                  )
                }) }
              </ul>
            )
            : (<p><i>No Contacts</i></p>) }
        </nav>
      </div>
      <div id="detail" className={ navigation.state === 'loading' && !isSearching ? 'loading' : '' }>
        <Outlet />
      </div>
    </>
  );
}