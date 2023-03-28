cd backend
for file in $(find . -name "*.example.yml"); do
  cp $file $(echo $file | sed 's/.example.yml/.yml/g');
done
cd ../

cd website
npm install
cd ../
