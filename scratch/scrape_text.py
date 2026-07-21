from bs4 import BeautifulSoup
import urllib.request

req = urllib.request.Request('https://www.fixturecalendar.com', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read()

soup = BeautifulSoup(html, 'html.parser')

# Find the main container
main = soup.find('main')
if not main:
    main = soup

# Print the text content of the first few event rows to see how data is structured
# Let's find all divs that have a substantial amount of text but aren't the whole page
for div in main.find_all('div', recursive=True):
    # Check if it has a link to an event
    link = div.find('a', href=lambda h: h and '/event/' in h)
    if link and div.parent and len(div.parent.find_all('div', recursive=False)) > 5:
        print("--- EVENT ROW ---")
        print(div.get_text(separator=' | ', strip=True))
        break

# Let's also just print the text of the body to see the sequence
text = soup.body.get_text(separator='\n', strip=True)
lines = text.split('\n')
for i, line in enumerate(lines[:100]):
    print(f"{i}: {line}")

