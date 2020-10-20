// Originally written in UploadPage by Allan
// Extracted as component by Joanne
import React, { useState } from 'react';
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"

export default function Tags(props: any) {
    function setTagInput(tags: string) {
        props.onChange(tags)
    }

    function clearTagInput() {
        const tagInput = document.getElementById("tags") as HTMLInputElement;
        tagInput.value = "";
        setTagInput("")
    }

    function handleTagEnterPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
          event.preventDefault();
          handleAddTags();
        }
    }

    function stateTagsToList() {
        const tagsList = props.tags.trim().split(" ").filter(Boolean);
        console.log(tagsList);
        return tagsList;
    }

    function handleAddTags() {
        const tagsToAdd = stateTagsToList();
        // Remove dups
        const tagsToAddWithoutDups = tagsToAdd.filter((tag: string, index: Number) => tagsToAdd.indexOf(tag) === index);
        // Remove non-alphanumeric
        checkTagsAreAlphaNumeric(tagsToAddWithoutDups);
        // Remove tags which are > 20 characters long
        checkTagsAreWithinLength(tagsToAddWithoutDups);
        updateTagsList(tagsToAddWithoutDups);
    }

    function deleteTagFromTagsList(tagToDelete: string) {
        const tagsListAfterDeletion = props.tagsList.filter((tag: string) => {
          return tag !== tagToDelete;
        });
        props.setTagsList({tagsList: tagsListAfterDeletion}, refreshTagButtons);
    }
  
    function deleteTag(event: React.MouseEvent<HTMLElement, MouseEvent>) {
        event.preventDefault();
        const target = event.target as HTMLElement;
        const tagToDelete = target.id;
        const tagsListAfterDeletion = props.tagsList.filter((tag: string) => {
          return tag !== tagToDelete;
        });
        props.setTagsList({tagsList: tagsListAfterDeletion}, refreshTagButtons);
    }

    function refreshTagButtons() {
        console.log("A");
        console.log(props.tagsList);
        const newTagButtons = props.tagsList.map((tag: string) => {
            return  <Button key={tag} id={tag} onClick={(e)=>deleteTag(e)}>
                        {tag}
                    </Button>
        });
        props.setTagsList({tagButtons: newTagButtons}, clearTagInput);
    }
  
    function updateTagsList(tagsToAdd: string[]) {
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
          updatedTagsList = updatedTagsList.slice(0,10);
          props.handleTagsErr("You are allowed a maximum of 10 keywords.")
        }
  
        props.setTagsList({tagsList: updatedTagsList}, refreshTagButtons);
    }
 
    function checkTagsAreAlphaNumeric(tagsToAdd: string[]) {
        tagsToAdd.forEach((tag: string, index: number) => {
          if (!tag.match(/^[a-z0-9]+$/i)) {
            tagsToAdd.splice(index, 1);
            props.handleTagsErr("Please only include letters and numbers in your keywords.")
          }
        });
      }
  
    function checkTagsAreWithinLength(tagsToAdd: string[]) {
        tagsToAdd.forEach((tag: string, index: number) => {
          if (tag.length > 20) {
            tagsToAdd.splice(index, 1);
            props.handleTagsErr("Please keep each keyword under 20 characters long.")
          }
        });
    }

    return(
        <>
        <Form.Group controlId="tags">
            <Form.Label>Space-separated keywords, e.g. "cat dog mouse". Click "Add Tags" to detect your keywords.</Form.Label>
            <Row>
                <Col xs={9}>
                <Form.Control 
                    type="text"
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => handleTagEnterPress(e)}>
                </Form.Control>
                </Col>
                <Button onClick={handleAddTags}>Add Tags</Button>
            </Row>
            <Form.Text className="text-muted tagsInfo">
                You can include 1 to 10 keywords. Keywords should describe the main aspects of your photo.
                <p>{props.tagsList.length} Detected keywords (click keyword to delete): {props.tagButtons}</p>
                <p className="error">{props.tagsErrMsg}</p>
            </Form.Text>
        </Form.Group>
        </>
    )
}