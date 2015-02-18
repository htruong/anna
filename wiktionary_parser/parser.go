// parser
package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"encoding/xml"
	"flag"
	"fmt"
	"log"
	"net/url"
	"os"
	"regexp"
	"strings"
)

var inputFile = flag.String("infile", "enwiki-latest-pages-articles.xml", "Input file path")
var indexFile = flag.String("indexfile", "out/article_list.txt", "article list output file")

var filter, _ = regexp.Compile("^Thể loại:.*|^file:.*|^talk:.*|^special:.*|^wikipedia:.*|^wiktionary:.*|^user:.*|^user_talk:.*")

type Redirect struct {
	Title string `xml:"title,attr"`
}

type Page struct {
	Title string   `xml:"title"`
	Redir Redirect `xml:"redirect"`
	Text  string   `xml:"revision>text"`
}

type WordSpecificMeaning struct {
	Mean     string   `json:"mean"`
	Examples []string `json:"ex"`
}

type WordDefinition struct {
	Kind     string                `json:"t"`
	Meanings []WordSpecificMeaning `json:"means"`
}

type WordAttr struct {
	Lang string           `json:"l"`
	Defs []WordDefinition `json:"defs"`
}

type Word struct {
	W    string   `json:"w"`
	Attr WordAttr `json:"attr"`
}

type Dict struct {
	Words []Word `json:"dict"`
}

type ParserStatus uint8

const (
	START ParserStatus = iota
	ENDSTART
	KIND
	DEF
)

func ProcessText(text string) WordAttr {
	var status ParserStatus = START
	a := WordAttr{}
	scanner := bufio.NewScanner(strings.NewReader(text))
	cateReg := regexp.MustCompile(`{{\-([a-z]+)\-}}`)
	for scanner.Scan() {
		line := scanner.Text()
		if cateReg.MatchString(line) {
			content := cateReg.FindStringSubmatch(line)[1]
			if status == START {
				a.Lang = content
				status = ENDSTART
				return a
			}
		}
	}
	return a
}

func ProcessPage(title string, text string) Word {
	/*
		outFile, err := os.Create("out/docs/" + title)
		if err == nil {
			writer := bufio.NewWriter(outFile)
			defer outFile.Close()
			writer.WriteString(text)
			writer.Flush()
		}
	*/

	attr := ProcessText(text)
	if attr.Lang == "vie" {
		log.Printf("'%s' lang = %s", title, attr.Lang)
	}
	return Word{W: title, Attr: attr}

}

func CanonicalizeTitle(title string) string {
	can := strings.ToLower(title)
	can = strings.Replace(can, " ", "_", -1)
	can = url.QueryEscape(can)
	return can
}

func main() {
	flag.Parse()

	words := make([]Word, 1, 1)

	xmlFile, err := os.Open(*inputFile)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer xmlFile.Close()

	decoder := xml.NewDecoder(xmlFile)
	total := 0
	var inElement string
	for {
		// Read tokens from the XML document in a stream.
		t, _ := decoder.Token()
		if t == nil {
			break
		}
		// Inspect the type of the token just read.
		switch se := t.(type) {
		case xml.StartElement:
			// If we just read a StartElement token
			inElement = se.Name.Local
			// ...and its name is "page"
			if inElement == "page" {
				var p Page
				// decode a whole chunk of following XML into the
				// variable p which is a Page (se above)
				decoder.DecodeElement(&p, &se)

				// Do some stuff with the page.
				//p.Title = CanonicalizeTitle(p.Title)
				m := filter.MatchString(p.Title)
				if !m && p.Redir.Title == "" {
					newWord := ProcessPage(p.Title, p.Text)
					if newWord.Attr.Lang == "vie" {
						words = append(words, newWord)
						total++
					}
				}
			}
		default:
		}

	}

	log.Printf("Total articles: %d \n", len(words))

	dict := Dict{Words: words}
	b, err := json.Marshal(dict)
	if err != nil {
		log.Println("Error:", err)
	}
	var out bytes.Buffer
	json.Indent(&out, b, "", " ")
	out.WriteTo(os.Stdout)

}
