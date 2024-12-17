import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <div style={styles.socialLinks}>
              <span>Facebook:</span>
            <a href="https://www.facebook.com/mclibraries" target="_blank" rel="noreferrer">mclibraries</a>
          </div>
        </div>
      </div>
      <div style={styles.section}> </div>
      <div style={styles.copy}>
      </div>

      <div style={styles.copy}>
        <p>© Copyright Mabini Colleges, Inc.  © Copyright MC Saliksik by WiseOnes. </p>
        
      </div>

    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    textAlign: "center",
    padding: "10px 0",
    bottom: 0,
    width: "100%",
    maxHeight: "10%",
    
  },
  container: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },
  section: {
    flex: "1 1 300px",
    margin: "5px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  socialLinks: {
    display: "flex",
    gap: "px",
    justifyContent: "center",
  },
  copy: {
    marginTop: "0px",
    fontSize: "12px",
  },
};

export default Footer;
