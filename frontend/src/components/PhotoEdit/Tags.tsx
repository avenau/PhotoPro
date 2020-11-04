import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export default function Tags(props: any) {
  const [tagButtons, setTagButtons] = useState<JSX.Element[]>();
  const [tagInput, setTagInput] = useState("");
  const [tagsErrMsg, setTagsErr] = useState(
    "Remember to add at least one keyword!"
  );
  const [tagsLength, setTagsLength] = useState(0)

  useEffect(() => {
    console.log('out here tags')
    console.log(props.tagsList)
    if (props.tagsList != undefined) {
      refreshTagButtons(props.tagsList)
      refreshTagsErr(props.tagsList)
    }
  }, [props.tagsList]
  )

  function clearTagInput() {
    const tagInput = document.getElementById("tags") as HTMLInputElement;
    tagInput.value = "";
    setTagInput("");
  }

  function handleTagEnterPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTags();
    }
  }

  function stateTagsToList() {
    const tagsList = tagInput.toLowerCase().trim().split(" ").filter(Boolean);
    return tagsList;
  }

  function handleAddTags() {
    const tagsToAdd = stateTagsToList();
    // Remove dups
    const tagsToAddWithoutDups = tagsToAdd.filter(
      (tag: string, index: Number) => tagsToAdd.indexOf(tag) === index
    );

    // Remove non-alphanumeric
    checkTagsAreAlphaNumeric(tagsToAddWithoutDups);
    // Remove tags which are > 20 characters long
    checkTagsAreWithinLength(tagsToAddWithoutDups);
    updateTagsList(tagsToAddWithoutDups);
  }

  function deleteTag(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    updatedTagsList: string[]
  ) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const tagToDelete = target.id;
    const tagsListAfterDeletion = updatedTagsList.filter((tag: string) => {
      return tag !== tagToDelete;
    });
    props.setTagsList(
      tagsListAfterDeletion,
      refreshTagsErr(tagsListAfterDeletion)
    );
    refreshTagButtons(tagsListAfterDeletion);
  }

  function refreshTagButtons(updatedTagsList: string[]) {
    const newTagButtons = updatedTagsList.map((tag: string) => {
      return (
        <span key={tag}>
          <Button id={tag} onClick={(e) => deleteTag(e, updatedTagsList)}>
            {tag}
          </Button>{" "}
        </span>
      );
    });
    setTagsLength(updatedTagsList.length)
    setTagButtons(newTagButtons);
    clearTagInput();
  }

  function updateTagsList(tagsToAdd: string[]) {
    // Convert to lower case
    // Remove tags from tagsToAdd which already exist in tagsList to avoid duplicate tags
    props.tagsList.forEach((tag: string) => {
      const matchIndex = tagsToAdd.indexOf(tag);
      if (matchIndex !== -1) {
        tagsToAdd.splice(matchIndex, 1);
      }
    });
    let updatedTagsList = props.tagsList.concat(tagsToAdd);
    // Allow 10 keywords maximum per photo
    if (updatedTagsList.length > 10) {
      updatedTagsList = updatedTagsList.slice(0, 10);
      setTagsErr("You are allowed a maximum of 10 keywords.");
    }

    props.setTagsList(updatedTagsList, refreshTagsErr(updatedTagsList));
    refreshTagButtons(updatedTagsList);
  }

  function refreshTagsErr(tagsList: string[]) {
    if (tagsList.length < 1) {
      setTagsErr("Please enter at least one keyword before uploading.");
      props.deactivateUploadButton();
    } else {
      setTagsErr("");
      props.activateUploadButton();
    }
  }

  function checkTagsAreAlphaNumeric(tagsToAdd: string[]) {
    tagsToAdd.forEach((tag: string, index: number) => {
      if (!tag.match(/^[a-z0-9]+$/i)) {
        tagsToAdd.splice(index, 1);
        setTagsErr("Please only include letters and numbers in your keywords.");
      }
    });
  }

  function checkTagsAreWithinLength(tagsToAdd: string[]) {
    tagsToAdd.forEach((tag: string, index: number) => {
      if (tag.length > 20) {
        tagsToAdd.splice(index, 1);
        setTagsErr("Please keep each keyword under 20 characters long.");
      }
    });
  }

  return (
    <>
      <Form.Group controlId="tags">
        <Form.Label>
          Space-separated keywords, e.g. "cat dog mouse". Click "Add Tags" to
          detect your keywords.
        </Form.Label>
        <Row>
          <Col xs={9}>
            <Form.Control
              type="text"
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                handleTagEnterPress(e)
              }
            ></Form.Control>
          </Col>
          <Button onClick={handleAddTags}>Add Tags</Button>
        </Row>
        <Form.Text className="text-muted tagsInfo">
          You can include 1 to 10 keywords. Keywords should describe the main
          aspects of your {props.tagType}.
          <p id="b">
            {tagsLength} Detected keywords (click keyword to delete):{" "}
            {tagButtons}
          </p>
          <p className="error">{tagsErrMsg}</p>
        </Form.Text>
      </Form.Group>
    </>
  );
}
