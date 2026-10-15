# Optional photography

The site ships with real-time Three.js scenes in every media slot, so it works with zero image files.

If you want to use the photographs from the Figma file instead (or any photography of your own),
export them from Figma (select the image frame -> Export -> JPG 2x) and drop them in this folder with
**exactly** these names. The site detects them automatically and swaps the WebGL scene for the photo
(with a clip-path reveal and scroll parallax):

| File                | Slot                                      |
| ------------------- | ----------------------------------------- |
| `hero-house.jpg`    | Home hero (craftsman residence at dusk)   |
| `interior.jpg`      | Home "Our Ethos" (vaulted living room)    |
| `technician.jpg`    | Home "Professional Reputation"            |

Keep each file under ~400 KB (use squoosh.app or similar) for a good Lighthouse score.
