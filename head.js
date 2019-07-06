var express = require('express');
var bp = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var path = require('path');
var hbs = require('hbs');
var port = 8000;
var md5 = require('md5');