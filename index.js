import express from "express";
import path from "path";
import session from "express-session";
import router from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: "xianfire-secret-key",
  resave: false,
  saveUninitialized: false
}));

// Helper function to process component includes
async function processComponents(content, fs) {
  const componentRegex = /\{\{>\s*([^}]+)\s*\}\}/g;
  let match;
  
  while ((match = componentRegex.exec(content)) !== null) {
    const componentPath = match[1];
    const fullPath = path.join(process.cwd(), "components", componentPath + ".xian");
    
    try {
      const componentContent = await new Promise((resolve, reject) => {
        fs.readFile(fullPath, (err, data) => {
          if (err) reject(err);
          else resolve(data.toString());
        });
      });
      
      content = content.replace(match[0], componentContent);
    } catch (error) {
      console.error(`Error loading component ${componentPath}:`, error);
      content = content.replace(match[0], `<!-- Component ${componentPath} not found -->`);
    }
  }
  
  return content;
}

app.engine("xian", (filePath, options, callback) => {
  import("fs").then(fs => {
    // Read the view file
    fs.readFile(filePath, (err, content) => {
      if (err) {
        console.error("Error reading view file:", err);
        return callback(err);
      }
      
      let viewContent = content.toString();
      
      try {
        // Check if view uses a layout
        if (viewContent.includes("<!-- Using auth layout -->")) {
          // Read auth layout
          fs.readFile(path.join(process.cwd(), "layouts", "auth.xian"), (err, layoutContent) => {
            if (err) {
              console.error("Error reading auth layout:", err);
              return callback(err);
            }
            
            let layout = layoutContent.toString();
            
            // Extract content and footer links from view
            const contentMatch = viewContent.match(/<!-- Using auth layout -->\s*([\s\S]*?)(?=<!-- Footer links|$)/);
            const footerMatch = viewContent.match(/<!-- Footer links for auth layout -->\s*([\s\S]*?)$/);
            
            const pageContent = contentMatch ? contentMatch[1].trim() : "";
            const footerLinks = footerMatch ? footerMatch[1].trim() : "";
            
            // Replace placeholders in layout
            layout = layout.replace("{{title}}", options.title || "Page");
            layout = layout.replace("{{pageTitle}}", options.pageTitle || "Page");
            layout = layout.replace("{{content}}", pageContent);
            layout = layout.replace("{{footerLinks}}", footerLinks);
            
            return callback(null, layout);
          });
        } else if (viewContent.includes("<!-- Using landing layout -->")) {
          // Read landing layout
          fs.readFile(path.join(process.cwd(), "layouts", "landing.xian"), (err, layoutContent) => {
            if (err) {
              console.error("Error reading landing layout:", err);
              return callback(err);
            }
            
            let layout = layoutContent.toString();
            
            // Extract content from view
            const contentMatch = viewContent.match(/<!-- Using landing layout -->\s*([\s\S]*?)$/);
            const pageContent = contentMatch ? contentMatch[1].trim() : "";
            
            // Replace placeholders in layout
            layout = layout.replace("{{title}}", options.title || "Page");
            layout = layout.replace("{{content}}", pageContent);
            
            // Process component includes
            processComponents(layout, fs).then(processedLayout => {
              return callback(null, processedLayout);
            }).catch(error => {
              console.error("Error processing components:", error);
              return callback(null, layout);
            });
          });
        } else if (viewContent.includes("<!-- Using admin layout -->")) {
          // Read admin layout
          fs.readFile(path.join(process.cwd(), "layouts", "admin.xian"), (err, layoutContent) => {
            if (err) {
              console.error("Error reading admin layout:", err);
              return callback(err);
            }
            
            let layout = layoutContent.toString();
            
            // Extract content from view
            const contentMatch = viewContent.match(/<!-- Using admin layout -->\s*([\s\S]*?)$/);
            const pageContent = contentMatch ? contentMatch[1].trim() : "";
            
            // Replace placeholders in layout
            layout = layout.replace("{{title}}", options.title || "Page");
            layout = layout.replace("{{content}}", pageContent);
            
            return callback(null, layout);
          });
        } else if (viewContent.includes("<!-- Using professor layout -->")) {
          // Read professor layout
          fs.readFile(path.join(process.cwd(), "layouts", "professor.xian"), (err, layoutContent) => {
            if (err) {
              console.error("Error reading professor layout:", err);
              return callback(err);
            }
            
            let layout = layoutContent.toString();
            
            // Extract content from view
            const contentMatch = viewContent.match(/<!-- Using professor layout -->\s*([\s\S]*?)$/);
            const pageContent = contentMatch ? contentMatch[1].trim() : "";
            
            // Replace placeholders in layout
            layout = layout.replace("{{title}}", options.title || "Page");
            layout = layout.replace("{{content}}", pageContent);
            
            return callback(null, layout);
          });
        } else if (viewContent.includes("<!-- Using student layout -->")) {
          // Read student layout
          fs.readFile(path.join(process.cwd(), "layouts", "student.xian"), (err, layoutContent) => {
            if (err) {
              console.error("Error reading student layout:", err);
              return callback(err);
            }
            
            let layout = layoutContent.toString();
            
            // Extract content from view
            const contentMatch = viewContent.match(/<!-- Using student layout -->\s*([\s\S]*?)$/);
            const pageContent = contentMatch ? contentMatch[1].trim() : "";
            
            // Replace placeholders in layout
            layout = layout.replace("{{title}}", options.title || "Page");
            layout = layout.replace("{{content}}", pageContent);
            
            return callback(null, layout);
          });
        } else {
          // No layout, return content as is
          return callback(null, viewContent);
        }
      } catch (error) {
        console.error("Template processing error:", error);
        return callback(error);
      }
    });
  }).catch(error => {
    console.error("FS import error:", error);
    return callback(error);
  });
});

app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "xian");

app.use("/", router);

app.listen(PORT, () => console.log(`🔥 XianFire running at http://localhost:${PORT}`));
