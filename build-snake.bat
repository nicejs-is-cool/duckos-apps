@echo off
cd dist
mkdir snake
cd snake
mkdir games
cd games
mkdir snake
cd snake
copy ..\..\..\..\packages\snek\resources\games\snek\* .
cd ..
cd ..
mkdir bin
copy ..\snek.js .\bin
tar -cvf ..\snake.tar *
cd ..
rmdir /s /q snake
cd ..