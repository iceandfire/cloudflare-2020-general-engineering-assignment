// Links array defined to include my portfolio, XenonHD project
// and my apps on the Google Play Store.
const links = [
  { "name": "Portfolio", "url": "http://iceandfire.co" },
  { "name": "XenonHD ROM", "url": "http://xenonhd.com" },
  { "name": "Apps on Google Play", "url": "https://play.google.com/store/apps/developer?id=Team+Horizon" }
]

// Social array to hold the links to my social profiles.
const social = [
  { "url": "https://linkedin.com/in/arham-jamal", "img":"https://simpleicons.org/icons/linkedin.svg" },
  { "url": "https://github.com/iceandfire", "img":"https://simpleicons.org/icons/github.svg" },
  { "url": "https://www.facebook.com/arhamjamal.iaf", "img":"https://simpleicons.org/icons/facebook.svg" }
]

// Add the EventListener
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.url.endsWith('/links')) {
    return new Response(JSON.stringify(links), {
      headers: { 'content-type': 'application/json;charset=UTF-8' },
  })
}

  const init = {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    }

  // Fetch the static HTML pages from the URL given in the
  // assignment description.
  const response = await fetch(
    'https://static-links-page.signalnerve.workers.dev/static/html', init,
  )

  // Call the different HTMLRewriter functions to
  // rewrite specific parts of the HTML page.
  return new HTMLRewriter()
    .on('div#links', new LinksTransformer())
    .on('div#profile', new ProfileTransformer())
    .on('h1#name', new NameTransformer())
    .on('img#avatar', new AvatarTransformer())
    .on('div#social', new SocialTransformer())
    .on('title', new TitleTransformer())
    .on('body', new BackgroundTransformer())
    .transform(response)
}

// Populates the buttons on the page with the links array.
class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    links.forEach(link => {
      element.append(`<a href="${link.url}">${link.name}</a>`, { html: true })
    })
  }
}

// Transforms the profile container by removing the display: none.
class ProfileTransformer {
  async element(element) {
    element.removeAttribute('style')
  }
}

// Transforms the h1#name and sets it to my username.
class NameTransformer {
  async element(element) {
    element.setInnerContent('arhamjamal')
  }
}

// Transforms the img#avatar and sets the img src to my avatar.
class AvatarTransformer {
  async element(element) {
    element.setAttribute('src', "http://iceandfire.co/wp-content/uploads/2019/01/201606221007959583-e1547770596312-598x694.jpg")
  }
}

// Similar to the LinksTransformer function above but instead
// takes the social array and populates the HTML page with
// my social links with icons.
class SocialTransformer {
  constructor(social) {
    this.social = social
  }

  async element(element) {
    element.removeAttribute('style')
    social.forEach(link => {
      element.append(`<a href="${link.url}"><img src=${link.img}></a>`, { html: true })
    })
  }
}

// Transforms the title of the page to my name.
class TitleTransformer {
  async element(element) {
    element.setInnerContent('Arham Jamal - iceandfire')
  }
}

// Transforms the body background color to teal 600 from
// Tailwind CSS's color palette
class BackgroundTransformer {
  async element(element) {
    element.setAttribute('class', 'bg-teal-600')
  }
}
