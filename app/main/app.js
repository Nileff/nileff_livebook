/**
 * Created by Alender on 03.03.2016.
 */

import React from "react"
import ReactDOM  from "react-dom"
import { Router, Route, IndexRoute, Redirect, useRouterHistory } from "react-router"
import { createHashHistory } from 'history'
import Main from "./main"
import BookMenu from "../contentMenu/bookMenu/bookMenu"
import AuthorMenu from "../contentMenu/authorMenu/authorMenu"
import GenreMenu from "../contentMenu/genreMenu/genreMenu"
import ChapterMenu from "../contentMenu/chapterMenu/chapterMenu"
import Book from "../content/book/book"
import Editor from "../content/editor/editor"
import Author from "../content/author/author"
import Settings from "../content/userData/settings"
import Rule from "../content/rule/rule"
import Other from "../content/other/other"

ReactDOM.render(
    <Router onUpdate={() => {window.scrollTo(0, 0); document.title = 'Живая Книга - литературный портал';}}
            history={useRouterHistory(createHashHistory)({ queryKey: false })}>
        <Redirect from="/!" to="library/all"/>
        <Redirect from="/" to="library/all"/>
        <Route path="/(!)" component={Main}>
            <Redirect from="library" to="/library/all"/>
            <Redirect from="home" to="/library/all"/>
            <Redirect from="user" to="/user/book"/>
            <Redirect from="info" to="/info/about"/>
            <Route path="home"/>
            <Route path="library">
                <Route path="all" component={BookMenu}/>
                <Route path="author">
                    <IndexRoute component={AuthorMenu}/>
                    <Route path=":id" component={Author}/>
                </Route>
                <Route path="genre">
                    <IndexRoute component={GenreMenu}/>
                    <Route path=":id" component={BookMenu}/>
                </Route>
                <Route path="favorite" component={BookMenu}/>
            </Route>
            <Route path="book/:id_book" component={Book}/>
            <Route path="write(/:id_book)" component={Editor}/>
            <Route path="edit/:id_book" component={Editor}/>
            <Route path="user">
                <Route path="book" component={BookMenu}/>
                <Route path="chapter" component={ChapterMenu}/>
                <Route path="settings" component={Settings}/>
            </Route>
            <Route path="info">
                <Route path="about" component={Other}/>
                <Route path="rule" component={Rule}/>
                <Route path="faq" component={Rule}/>
                <Route path="contact" component={Other}/>
            </Route>
            <Route path="*" component={Other}/>
        </Route>
    </Router>, document.getElementById("main"));